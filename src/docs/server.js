const express = require('express');
const next = require('next');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve Swagger docs at /api-docs
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(4000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:4000');
  });
});
