const http = require('http');
const fs = require('fs');
const url = require('url');
const commitFile = require('./data/commits');

const port = 3000;
const host = 'localhost';

var server = http.createServer((req, res) => {

  var params = url.parse(req.url, true).query;

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      var commitFeed = JSON.stringify(commitFile, null, 2);
      data = data.replace('{{ commitFeed }}', commitFeed);
      res.end(data);
      console.log(params);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Listening at http:// ${ host }:${ port }`);
});
