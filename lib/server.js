const http = require('http');
const url = require('url');
const fs = require('fs');

var htmlParser = require('./htmlParser');
var port = 3000;
var hostname = 'localhost';

var commitFeed = require('../data/commits.json')


var server = http.createServer(function(req, res) {
  var myObj = url.parse(req.url);
  if(myObj.pathname === '/commits'){
    var repo = '.*repo=(.*)';
    var user = new RegExp('user=(.*)\&');
    console.log(myObj.query.match(repo)[1]);
  }  
  fs.readFile('./public/commits.html', 'utf8', function(err, data) {
    if (err) {
      console.error(err)
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(htmlParser.parse(data, '{{ commitFeed }}', commitFeed));
      // pass in the parsed data. something like res.end(parse(data))
    }
  });
});

server.listen(port, hostname, function() {
  console.log(`Listening at http://${ hostname }:${ port }`);
});

module.exports = server;