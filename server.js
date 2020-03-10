const express = require('express');
const dbRouter = require('./data/db-router.js');

const server = express();

server.use(express.json());
server.use('/api/posts', dbRouter);

server.get('/', (req, res) => {
  const introText = process.env.INTRO;
  res.status(200).json({INTRO: introText});
});

module.exports = server;