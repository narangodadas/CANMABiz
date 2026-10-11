const contactHandler = require('../api/contact');

const MAX_BODY_BYTES = 12000;

module.exports = function setupProxy(app) {
  app.use('/api/contact', (req, res) => {
    const chunks = [];
    let bodyBytes = 0;
    let bodyTooLarge = false;

    req.on('data', (chunk) => {
      bodyBytes += chunk.length;
      if (bodyBytes > MAX_BODY_BYTES) {
        bodyTooLarge = true;
        return;
      }
      if (!bodyTooLarge) chunks.push(chunk);
    });

    req.on('end', async () => {
      if (bodyTooLarge) {
        res.status(413).json({ message: 'Your enquiry is too large to submit.' });
        return;
      }

      req.body = Buffer.concat(chunks).toString('utf8');
      try {
        await contactHandler(req, res);
      } catch (error) {
        console.error('Local contact API failed.', { name: error.name });
        if (!res.headersSent) {
          res.status(500).json({ message: 'The enquiry service is temporarily unavailable. Please try again later.' });
        }
      }
    });
  });
};
