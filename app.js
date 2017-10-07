const http = require('http');
const fs = require('fs');
const url = require('url');
let commitFeed = require('./data/commits');

const port = process.env.PORT || 3000;
const host = 'localhost';

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  console.log(urlObj.query.user);
  console.log(urlObj.query.repo);
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      commitFeed = JSON.stringify(commitFeed, null, 2);
      res.end(data.replace('{{ commitFeed }}', commitFeed));
    }
  });
});

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
