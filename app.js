var http = require('http');
var fs = require('fs');
var url = require('url');
var wrapper = require('./lib/github_wrapper');

var extractInfo = (path) => {
  var pathObj = url.parse(path);
  var lastVal = pathObj.pathname.split('/')[1];
  if (lastVal === 'commits') {
    var matches = pathObj.query.match(/user=(.*)&repo=(.*)$/)
    var user = matches[1];
    var repo = matches[2];

    return {
      user: user,
      repo: repo
    }
  }
}

var server = http.createServer((req, res) => {
  var fileString = fs.readFileSync('./public/index.html').toString('utf8');
  var info = extractInfo(req.url);
  if (info) {
    var commits = wrapper.getCommits(info.user, info.repo);
    commits.then((data) => {
      var commitsString = JSON.stringify(data, null, 2);
      var edited = fileString.replace(/{{ commitFeed }}/, commitsString);
      res.writeHead(200, {contentType: 'application/html'});
      res.end(edited);
    }, (reason) => {
      var edited = fileString.replace(/{{ commitFeed }}/, reason);
      res.writeHead(404, {contentType: 'application/html'});
      res.end(edited);
    });
  } else {
    var commits = require('./data/commits.json');
    var commitsString = JSON.stringify(commits, null, 2);
    var edited = fileString.replace(/{{ commitFeed }}/, commitsString);
    res.writeHead(200, {contentType: 'application/html'});
    res.end(edited);
  }
});

server.listen(3000, 'localhost', (() => {
  console.log('Starting up your server Sir!')
}))