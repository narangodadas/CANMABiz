
const express = require('express');
const contactHandler = require('./contact');

const app = express();

const allowedOrigins = [
  'https://canmabiz.com',
  'https://www.canmabiz.com'
];

app.disable('x-powered-by');

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS' && req.path === '/api/contact') {
    return res.status(
      allowedOrigins.includes(origin) ? 204 : 403
    ).end();
  }

  next();
});

app.use(express.json({ limit: '12kb' }));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CANMABiz Contact API'
  });
});

app.post('/api/contact', contactHandler);

app.use((err, req, res, next) => {
  console.error('API error:', err.message);
  res.status(err.status || 500).json({
    message: 'Unable to process the request.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CANMABiz API running on port ${PORT}`);
});
