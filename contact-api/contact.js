
const { createHash } = require('crypto');

const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_TO_EMAIL = 'support@canmabiz.com';

const allowedOrigins = [
  'https://canmabiz.com',
  'https://www.canmabiz.com'
];

const localRateLimits = new Map();

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs
  );

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function hasInvalidControlCharacters(
  value,
  allowMessageWhitespace = false
) {
  return allowMessageWhitespace
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)
    : /[\u0000-\u001F\u007F]/.test(value);
}

function validateInput(body) {
  const fields = [
    'name',
    'email',
    'phone',
    'company',
    'service',
    'message',
    'website'
  ];

  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return null;
  }

  if (
    fields.some(
      field =>
        body[field] !== undefined &&
        typeof body[field] !== 'string'
    )
  ) {
    return null;
  }

  const values = Object.fromEntries(
    fields.map(field => [
      field,
      (body[field] || '').trim()
    ])
  );

  if (
    !values.name ||
    values.name.length > 120 ||
    hasInvalidControlCharacters(values.name) ||

    !values.email ||
    values.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email) ||
    hasInvalidControlCharacters(values.email) ||

    values.phone.length > 40 ||
    hasInvalidControlCharacters(values.phone) ||

    values.company.length > 120 ||
    hasInvalidControlCharacters(values.company) ||

    !values.service ||
    values.service.length > 120 ||
    hasInvalidControlCharacters(values.service) ||

    !values.message ||
    values.message.length > 5000 ||
    hasInvalidControlCharacters(values.message, true)
  ) {
    return null;
  }

  return values;
}

function getClientIp(req) {
  // Only trust forwarded headers when Express has
  // been configured with a trusted proxy.
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

async function isRateLimited(req) {
  const ipHash = createHash('sha256')
    .update(getClientIp(req))
    .digest('hex')
    .slice(0, 32);

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl || redisToken) {
    if (!redisUrl || !redisToken) {
      throw new Error(
        'Rate limiter configuration is incomplete.'
      );
    }

    if (new URL(redisUrl).protocol !== 'https:') {
      throw new Error(
        'Rate limiter URL must use HTTPS.'
      );
    }

    const redisKey = `canmabiz:contact:${ipHash}`;

    const response = await fetchWithTimeout(
      `${redisUrl.replace(/\/$/, '')}/pipeline`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['EXPIRE', redisKey, RATE_LIMIT_WINDOW_SECONDS]
        ])
      },
      2500
    );

    const results = await response
      .json()
      .catch(() => null);

    if (
      !response.ok ||
      !Array.isArray(results) ||
      results.length < 2 ||
      results[0]?.error ||
      results[1]?.error ||
      results[1]?.result !== 1
    ) {
      throw new Error(
        'Rate limiter request failed.'
      );
    }

    const count = Number(results[0]?.result);

    if (!Number.isFinite(count)) {
      throw new Error(
        'Invalid rate limiter response.'
      );
    }

    return count > RATE_LIMIT_MAX_REQUESTS;
  }

  // Production requires shared rate limiting.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'A distributed rate limiter is required in production.'
    );
  }

  // Local development fallback only.
  const now = Date.now();

  for (const [key, entry] of localRateLimits) {
    if (entry.resetAt <= now) {
      localRateLimits.delete(key);
    }
  }

  const current = localRateLimits.get(ipHash);

  const next =
    current && current.resetAt > now
      ? {
          count: current.count + 1,
          resetAt: current.resetAt
        }
      : {
          count: 1,
          resetAt:
            now + RATE_LIMIT_WINDOW_SECONDS * 1000
        };

  localRateLimits.set(ipHash, next);

  return next.count > RATE_LIMIT_MAX_REQUESTS;
}

function getSenderDomain(from) {
  const mailbox =
    from.match(/<([^<>]+)>/)?.[1] || from;

  const separator = mailbox.lastIndexOf('@');

  return separator < 0
    ? ''
    : mailbox
        .slice(separator + 1)
        .trim()
        .toLowerCase();
}

module.exports = async function contactHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // Allow POST requests only.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return res.status(405).json({
      message: 'Method not allowed.'
    });
  }

  // Validate request origin.
  const origin = req.headers.origin;

  if (
    typeof origin !== 'string' ||
    !allowedOrigins.includes(origin)
  ) {
    return res.status(403).json({
      message: 'This request could not be accepted.'
    });
  }

  // Validate content type.
  const contentType = String(
    req.headers['content-type'] || ''
  )
    .toLowerCase()
    .split(';', 1)[0]
    .trim();

  if (contentType !== 'application/json') {
    return res.status(415).json({
      message:
        'Please submit the enquiry using the website form.'
    });
  }

  // Validate request size.
  const contentLength = Number(
    req.headers['content-length'] || 0
  );

  const bodyLength =
    typeof req.body === 'string'
      ? Buffer.byteLength(req.body)
      : Buffer.byteLength(
          JSON.stringify(req.body || {})
        );

  if (
    !Number.isFinite(contentLength) ||
    contentLength < 0 ||
    contentLength > 12000 ||
    bodyLength > 12000
  ) {
    return res.status(413).json({
      message:
        'Your enquiry is too large to submit.'
    });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        message:
          'Please check the enquiry details and try again.'
      });
    }
  }

  // Validate contact form fields.
  const input = validateInput(body);

  if (!input) {
    return res.status(400).json({
      message:
        'Please complete all required fields with valid information.'
    });
  }

  // Honeypot spam protection.
  if (input.website) {
    return res.status(400).json({
      message:
        'This request could not be accepted.'
    });
  }

  // Read Resend credentials.
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error(
      'Contact email configuration is missing.'
    );

    return res.status(503).json({
      message:
        'The enquiry service is temporarily unavailable. Please try again later.'
    });
  }

  const senderDomain = getSenderDomain(from);

  if (
    !senderDomain ||
    ['gmail.com', 'googlemail.com'].includes(
      senderDomain
    )
  ) {
    console.error(
      'Invalid Resend sender domain.'
    );

    return res.status(503).json({
      message:
        'The email sender is not configured correctly.'
    });
  }

  // Apply rate limiting.
  try {
    const limited = await isRateLimited(req);

    if (limited) {
      return res.status(429).json({
        message:
          'Too many enquiries have been submitted. Please wait a few minutes and try again.'
      });
    }
  } catch (error) {
    console.error(
      'Contact rate limiter failed:',
      error.message
    );

    return res.status(503).json({
      message:
        'The enquiry service is temporarily unavailable. Please try again later.'
    });
  }

  // Prepare email content.
  const submittedAt = new Date().toISOString();

  const emailText = [
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
    input.message
  ].join('\n');

  // Send email through Resend.
  try {
    const providerResponse = await fetchWithTimeout(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [CONTACT_TO_EMAIL],
          reply_to: input.email,
          subject:
            `[CANMABiz] ${input.service} enquiry from ${input.name}`,
          text: emailText
        })
      },
      8000
    );

    const providerResult = await providerResponse
      .json()
      .catch(() => null);

    if (
      !providerResponse.ok ||
      typeof providerResult?.id !== 'string' ||
      !providerResult.id
    ) {
      console.error(
        'Resend rejected the enquiry.',
        {
          status: providerResponse.status,
          error: providerResult?.message
        }
      );

      if (providerResponse.status === 401) {
        return res.status(503).json({
          message:
            'The email provider rejected its API key.'
        });
      }

      if (providerResponse.status === 403) {
        return res.status(503).json({
          message:
            'The email sender domain is not verified in Resend.'
        });
      }

      if (providerResponse.status === 429) {
        return res.status(503).json({
          message:
            'The email service is temporarily busy. Please try again shortly.'
        });
      }

      return res.status(502).json({
        message:
          'We could not send your enquiry right now. Please try again shortly.'
      });
    }

    console.log(
      'Contact enquiry accepted by Resend:',
      providerResult.id
    );

    return res.status(200).json({
      success: true,
      message:
        'Your enquiry has been sent successfully.'
    });
  } catch (error) {
    console.error(
      'Contact email request failed:',
      error.name,
      error.message
    );

    return res.status(502).json({
      message:
        'We could not send your enquiry right now. Please try again shortly.'
    });
  }
};
