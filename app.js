'use strict';
const fs = require('fs');
const http = require('http');
const port = 3000;
const host = '127.0.0.1';
const data = require('./data/commits.json');
const router = require('./router.js');

const server = http.createServer(router.handle);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
