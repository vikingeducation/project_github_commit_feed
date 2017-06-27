const http = require('http');
const fs = require('fs');
const url = require('url');
var githubWrapper = require('./lib/github_wrapper');
var commitFeedJSON = require('./data/commits.json');
var router = require('./lib/router');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
