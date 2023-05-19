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

// POST /api/users/register
// POST /api/users/login
// DELETE /api/users/:id

// GET /api/posts
// POST /api/posts
// PATCH /api/posts/:id
// DELETE /api/posts/:id

// GET /api/tags
// GET /api/tags/:tagName/posts


const PORT = 3000;
server.listen(PORT, () => {
  console.log('The server is up on port', PORT);
});