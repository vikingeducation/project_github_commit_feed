const http = require('http');
const fs = require('fs');

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(fs.readFileSync('./public/index.html'))
})

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
