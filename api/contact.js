const { createHash } = require('crypto');

const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_TO_EMAIL = 'support@canmabiz.com';
const localRateLimits = new Map();

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

const hasInvalidControlCharacters = (value, allowMessageWhitespace = false) => (
  allowMessageWhitespace
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)
    : /[\u0000-\u001F\u007F]/.test(value)
);

function validateInput(body) {
  const fields = ['name', 'email', 'phone', 'company', 'service', 'message', 'website'];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  if (fields.some((field) => body[field] !== undefined && typeof body[field] !== 'string')) return null;

  const values = Object.fromEntries(fields.map((field) => [field, (body[field] || '').trim()]));
  if (
    !values.name || values.name.length > 120 || hasInvalidControlCharacters(values.name)
    || !values.email || values.email.length > 254
    || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)
    || hasInvalidControlCharacters(values.email)
    || values.phone.length > 40 || hasInvalidControlCharacters(values.phone)
    || values.company.length > 120 || hasInvalidControlCharacters(values.company)
    || !values.service || values.service.length > 120 || hasInvalidControlCharacters(values.service)
    || !values.message || values.message.length > 5000 || hasInvalidControlCharacters(values.message, true)
  ) return null;

  return values;
}

function getClientIp(req) {
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',').pop().trim();
  }
  return 'unknown';
}

async function isRateLimited(req) {
  const ipHash = createHash('sha256').update(getClientIp(req)).digest('hex').slice(0, 32);
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl || redisToken) {
    if (!redisUrl || !redisToken || new URL(redisUrl).protocol !== 'https:') {
      throw new Error('Rate limiter configuration is invalid.');
    }
    const response = await fetchWithTimeout(`${redisUrl.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', `canmabiz:contact:${ipHash}`],
        ['EXPIRE', `canmabiz:contact:${ipHash}`, RATE_LIMIT_WINDOW_SECONDS],
      ]),
    }, 2500);
    const results = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(results) || results[0]?.error || results[1]?.error) {
      throw new Error('Rate limiter request failed.');
    }
    return Number(results[0]?.result) > RATE_LIMIT_MAX_REQUESTS;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('A distributed rate limiter is required in production.');
  }

  const now = Date.now();
  for (const [key, entry] of localRateLimits) {
    if (entry.resetAt <= now) localRateLimits.delete(key);
  }
  const current = localRateLimits.get(ipHash);
  const next = current && current.resetAt > now
    ? { count: current.count + 1, resetAt: current.resetAt }
    : { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 };
  localRateLimits.set(ipHash, next);
  return next.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeHost(host) {
  return typeof host === 'string' ? host.toLowerCase() : '';
}

function getSenderDomain(from) {
  const mailbox = from.match(/<([^<>]+)>/)?.[1] || from;
  const separator = mailbox.lastIndexOf('@');
  return separator < 0 ? '' : mailbox.slice(separator + 1).trim().toLowerCase();
}

module.exports = async function contactHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (normalizeHost(new URL(origin).host) !== normalizeHost(host)) {
        return res.status(403).json({ message: 'This request could not be accepted.' });
      }
    } catch {
      return res.status(403).json({ message: 'This request could not be accepted.' });
    }
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase().split(';', 1)[0].trim();
  if (contentType !== 'application/json') {
    return res.status(415).json({ message: 'Please submit the enquiry using the website form.' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  const bodyLength = typeof req.body === 'string'
    ? Buffer.byteLength(req.body)
    : Buffer.byteLength(JSON.stringify(req.body || {}));
  if (contentLength > 12000 || bodyLength > 12000) {
    return res.status(413).json({ message: 'Your enquiry is too large to submit.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ message: 'Please check the enquiry details and try again.' });
    }
  }

  const input = validateInput(body);
  if (!input) {
    return res.status(400).json({ message: 'Please complete all required fields with valid information.' });
  }
  if (input.website) {
    return res.status(400).json({ message: 'This request could not be accepted.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('Contact email is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.');
    const message = process.env.NODE_ENV === 'production'
      ? 'The enquiry service is temporarily unavailable. Please try again later.'
      : 'Local email setup is incomplete. Add RESEND_API_KEY and CONTACT_FROM_EMAIL to .env.local, then restart npm start.';
    return res.status(503).json({ message });
  }
  if (['gmail.com', 'googlemail.com'].includes(getSenderDomain(from))) {
    console.error('Contact sender uses a Gmail address; Resend requires a verified sending domain.');
    return res.status(503).json({
      message: 'Resend cannot send from a Gmail address. Verify canmabiz.com in Resend, set CONTACT_FROM_EMAIL to a sender on that verified domain, and restart the server.',
    });
  }

  try {
    if (await isRateLimited(req)) {
      return res.status(429).json({ message: 'Too many enquiries have been submitted. Please wait a few minutes and try again.' });
    }
  } catch (error) {
    console.error('Contact rate limiter failed.', { message: error.message });
    return res.status(503).json({ message: 'The enquiry service is temporarily unavailable. Please try again later.' });
  }

  const submittedAt = new Date().toISOString();
  const text = [
    'A new enquiry was submitted through the CANMABiz website.',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'Not provided'}`,
    `Company: ${input.company || 'Not provided'}`,
    `Service required: ${input.service}`,
    `Submitted at (UTC): ${submittedAt}`,
    '',
    'Message:',
    input.message,
  ].join('\n');

  try {
    const providerResponse = await fetchWithTimeout('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `[CANMABiz] ${input.service} enquiry from ${input.name}`,
        text,
      }),
    }, 8000);
    const providerResult = await providerResponse.json().catch(() => null);

    if (!providerResponse.ok || typeof providerResult?.id !== 'string' || !providerResult.id) {
      console.error('Contact email provider did not accept an enquiry.', { status: providerResponse.status });
      if (providerResponse.status === 401) {
        return res.status(503).json({
          message: 'The email provider rejected its API key. Check RESEND_API_KEY in your server environment.',
        });
      }
      if (providerResponse.status === 403) {
        return res.status(503).json({
          message: 'The email provider rejected the sender. Verify the sender domain in Resend and use an address on that domain.',
        });
      }
      return res.status(502).json({ message: 'We could not send your enquiry right now. Please try again shortly.' });
    }

    return res.status(200).json({ success: true, message: 'Your enquiry has been sent successfully.' });
  } catch (error) {
    console.error('Contact email provider request failed.', { name: error.name });
    return res.status(502).json({ message: 'We could not send your enquiry right now. Please try again shortly.' });
  }
};
