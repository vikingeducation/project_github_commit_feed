// server vars
const http = require('http');
const fs = require('fs');
var port = 3000;
var hostname = 'localhost';

// parsers
var htmlParser = require('./parsers/htmlParser');
var requestParser = require('./parsers/request');

// our server should serve .public/commit.html on and GET request
// our server should handle a POST request to /github/webhooks endpoint

// 1) figure out how to listen to a post

var server = http.createServer(function(req, res) {
  if(req.url === '/github/webhooks'){
    var _headers = {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
    };
    req.on("data", (data) => {
      console.log("Dataaaaaa:", JSON.parse(data.pusher))
      // var name = data.pusher.name;
      // var repo = data.repository.name;
      //console.log(JSON.parse(data.payload));
    } )
    res.writeHead(200, _headers);
    res.end("yo")
  }else {
    fs.readFile('./public/commits.html', 'utf8', function(err, data) {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html"
        });
        requestParser.parse(req)
        .then(function(){
            res.end(htmlParser.parse(data, '{{ commitFeed }}', require('../data/commits.json') ))
          }
        )
      }
    });

  }

});

server.listen(port, hostname, function() {
  console.log(`Listening at http://${ hostname }:${ port }`);
});

module.exports = server;