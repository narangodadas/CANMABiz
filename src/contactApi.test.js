import contactHandler from '../api/contact';

const originalFetch = global.fetch;
const environmentKeys = [
  'RESEND_API_KEY',
  'CONTACT_FROM_EMAIL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];
let previousEnvironment;

function createRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-real-ip': `198.51.100.${Math.ceil(Math.random() * 200)}`,
    },
    body: {
      name: 'Test Customer',
      email: 'customer@gmail.com',
      phone: '+94761234567',
      company: 'Example Company',
      service: 'Business Solutions',
      message: 'Please contact me about business support.',
    },
    ...overrides,
  };
}

function createResponse() {
  return {
    setHeader: jest.fn(),
    status: jest.fn(function setStatus(statusCode) {
      this.statusCode = statusCode;
      return this;
    }),
    json: jest.fn(function setJson(payload) {
      this.payload = payload;
      return this;
    }),
  };
}

beforeEach(() => {
  previousEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = 'test-secret';
  process.env.CONTACT_FROM_EMAIL = 'CANMABiz Website <website@canmabiz.com>';
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ id: 'resend-message-id' }),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  environmentKeys.forEach((key) => {
    if (previousEnvironment[key] === undefined) delete process.env[key];
    else process.env[key] = previousEnvironment[key];
  });
});

test('sends a validated inquiry from CANMABiz with the visitor as Reply-To', async () => {
  const response = createResponse();

  await contactHandler(createRequest(), response);

  expect(response.statusCode).toBe(200);
  expect(response.payload.message).toMatch(/sent successfully/i);
  expect(global.fetch).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({
    method: 'POST',
    headers: expect.objectContaining({ Authorization: 'Bearer test-secret' }),
  }));
  const email = JSON.parse(global.fetch.mock.calls[0][1].body);
  expect(email).toMatchObject({
    from: 'CANMABiz Website <website@canmabiz.com>',
    to: ['support@canmabiz.com'],
    reply_to: 'customer@gmail.com',
    subject: '[CANMABiz] Business Solutions enquiry from Test Customer',
  });
  expect(email.text).toContain('Company: Example Company');
  expect(email.text).toContain('Please contact me about business support.');
  expect(email.text).toMatch(/Submitted at \(UTC\):/);
});

test('rejects malformed email addresses without contacting the email provider', async () => {
  const response = createResponse();

  await contactHandler(createRequest({
    body: { ...createRequest().body, email: 'customer@example.com\r\nBcc: attacker@example.com' },
  }), response);

  expect(response.statusCode).toBe(400);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('rejects empty required fields and honeypot submissions', async () => {
  const missingFieldsResponse = createResponse();
  await contactHandler(createRequest({
    body: { ...createRequest().body, name: '  ', message: '' },
  }), missingFieldsResponse);

  const honeypotResponse = createResponse();
  await contactHandler(createRequest({
    body: { ...createRequest().body, website: 'https://spam.example' },
  }), honeypotResponse);

  expect(missingFieldsResponse.statusCode).toBe(400);
  expect(honeypotResponse.statusCode).toBe(400);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('does not claim success if the provider does not confirm acceptance with an id', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  });
  const response = createResponse();
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  await contactHandler(createRequest(), response);

  expect(response.statusCode).toBe(502);
  expect(response.payload.message).toMatch(/could not send/i);
  expect(consoleError).toHaveBeenCalled();
  consoleError.mockRestore();
});

test('returns a clear local setup message when email credentials are missing', async () => {
  delete process.env.RESEND_API_KEY;
  const response = createResponse();

  await contactHandler(createRequest(), response);

  expect(response.statusCode).toBe(503);
  expect(response.payload.message).toMatch(/add RESEND_API_KEY and CONTACT_FROM_EMAIL to \.env\.local/i);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('explains that Resend cannot use a Gmail sender address', async () => {
  process.env.CONTACT_FROM_EMAIL = 'CANMABiz <digitalcanmabiz@gmail.com>';
  const response = createResponse();
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  await contactHandler(createRequest(), response);

  expect(response.statusCode).toBe(503);
  expect(response.payload.message).toMatch(/cannot send from a Gmail address/i);
  expect(global.fetch).not.toHaveBeenCalled();
  consoleError.mockRestore();
});

test('gives a clear sender-domain error when Resend rejects the sender', async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 403,
    json: async () => ({ message: 'Domain not verified' }),
  });
  const response = createResponse();
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  await contactHandler(createRequest(), response);

  expect(response.statusCode).toBe(503);
  expect(response.payload.message).toMatch(/verify the sender domain in Resend/i);
  consoleError.mockRestore();
});

test('rate limits repeated submissions from the same client', async () => {
  const requests = Array.from({ length: 6 }, () => createRequest({
    headers: {
      'content-type': 'application/json',
      'x-real-ip': '203.0.113.250',
    },
  }));
  const responses = requests.map(() => createResponse());

  for (let index = 0; index < requests.length; index += 1) {
    await contactHandler(requests[index], responses[index]);
  }

  expect(responses.map(({ statusCode }) => statusCode)).toEqual([200, 200, 200, 200, 200, 429]);
  expect(global.fetch).toHaveBeenCalledTimes(5);
});
