// server vars
const http = require('http');
const fs = require('fs');
var port = 3000;
var hostname = 'localhost';

// Github vars
var apikey = process.env.githubKey;
var GithubWrapper = require('./GithubWrapper');
var githubWrapper = new GithubWrapper(apikey);
githubWrapper.authenticate();

// parsers
var htmlParser = require('./parsers/htmlParser');
var requestParser = require('./parsers/request');
var githubParser = require('./parsers/githubParser');


var server = http.createServer(function(req, res) {
  if(req.url === '/github/webhooks'){
    var _headers = {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
    };
    req.on("data", (data) => {
      data = JSON.parse(data);

      var name = data.pusher.name;
      var repo = data.repository.name;
      githubWrapper.getCommits(
        {
          owner: name,
          repo: repo
        }, function(err, res){
            githubParser.parse(res).then(function(obj){
              res.writeHead(200, _headers);
              res.end(htmlParser.parse(data, '{{ commitFeed }}', require('../data/commits.json') ))
            })
        });
    } )

  } else {
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