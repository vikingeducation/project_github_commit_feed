const http = require('http');
const fs = require('fs');
const url = require('url');
var commitFeedJSON = require('./data/commits.json');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  var queryParams, path, parsedQuery;
  var path = url.parse(req.url).query;

  parsedQuery = path.split(/(=|&)/g);
  queryParams = {
    user: parsedQuery[2],
    repo: parsedQuery[6]
  };
  console.log(queryParams);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('public/index.html', 'utf8', (err, data) => {
    if (err) return res.end(err);
    res.end(data.replace('{{commitFeed}}', JSON.stringify(commitFeedJSON, null, 2)));
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
