const winston = require('winston');
const express = require('express');

const router = express.Router();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/var/log/nodejs/nodejs.log' }),
  ],
});

// Routes
router.post('/error', (req, res) => {
  const errorString = JSON.stringify(req.body).replace(/"/g, "'");

  logger.error(`Client Error: ${errorString}`);
  res.send();
});

module.exports = router;
