const http = require('http');
const fs = require('fs');

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 not found');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(data);
    });
  });

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
