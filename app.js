const http = require('http');
const fs = require('fs');
var commitFeedJSON = require('./data/commits.json');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
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
