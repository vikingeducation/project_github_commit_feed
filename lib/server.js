// Github vars
var apikey = process.env.githubKey;
var GithubWrapper = require('../lib/GithubWrapper');
var githubWrapper = new GithubWrapper(apikey);
// server vars
const http = require('http');
const fs = require('fs');
var port = 3000;
var hostname = 'localhost';
// request parsers
var urlParser = require('./urlParser');
var htmlParser = require('./htmlParser');
var githubParser = require('./githubParser');
// view variables
var commitFeed = require('../data/commits.json')
/* End Variables */

var server = http.createServer(function(req, res) {
  var parsedParams = urlParser.parse(req);

  if(parsedParams.user && parsedParams.repo){
    let username = parsedParams.user;
    let repo = parsedParams.repo;
    //make request to github
    githubWrapper.authenticate();
    githubWrapper.getCommits(
    {
      owner: username,
      repo: repo
    }
    , function(err, res){
        githubParser.parse(res);
    });
  }

  fs.readFile('./public/commits.html', 'utf8', function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(htmlParser.parse(data, '{{ commitFeed }}', commitFeed));
    }
  });
});

server.listen(port, hostname, function() {
  console.log(`Listening at http://${ hostname }:${ port }`);
});

module.exports = server;