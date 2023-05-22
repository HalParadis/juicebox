const express = require('express');
const apiRouter = require('./api');
const morgan = require('morgan');
const { client } = require('./db');
require('dotenv').config();

client.connect();

const server = express();

server.use(morgan('dev'));
server.use(express.json());
server.use('/api', apiRouter);

server.get('/background/:color', (req, res, next) => {
  console.log('entered get request');
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('The server is up on port', PORT);
});