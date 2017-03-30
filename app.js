const http = require('http');
const fs = require('fs');
const url = require('url');

const json = require('./data/commits.json');

const port = 3000;
const host = 'localhost';

const server = http.createServer( (req, res) => {

  let reqQuery = url.parse(req.url).query;
  

  fs.readFile('./public/index.html', 'utf-8', (err, data) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    data = data.replace('{{ commitFeed }}', JSON.stringify(json, null, 2));
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});

