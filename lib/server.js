// server vars
const http = require('http');
const fs = require('fs');
var port = 3000;
var hostname = 'localhost';

// parsers
var htmlParser = require('./parsers/htmlParser');
var requestParser = require('./parsers/request');

var commitFeed = require('../data/commits.json')

var server = http.createServer(function(req, res) {

  fs.readFile('./public/commits.html', 'utf8', function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      requestParser.parse(req).then(
        res.end(htmlParser.parse(data, '{{ commitFeed }}', commitFeed ))
      )
    }
  });
});

server.listen(port, hostname, function() {
  console.log(`Listening at http://${ hostname }:${ port }`);
});

module.exports = server;