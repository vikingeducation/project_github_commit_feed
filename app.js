const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 3000;
const host = 'localhost';

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(data);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
