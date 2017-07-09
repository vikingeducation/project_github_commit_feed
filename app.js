var http = require('http');
var fs = require('fs');
var commits = require('./data/commits.json');
var url = require('url');

var extractInfo = (path) => {
  var pathObj = url.parse(path);
  var lastVal = pathObj.pathname.split('/')[1];
  if (lastVal == 'commits') {
    var matches = pathObj.query.match(/user=(.*)&repo=(.*)$/)
    var user = matches[1];
    var repo = matches[2];

    console.log(user);
    console.log(repo);
  }
}

var server = http.createServer((req, res) => {
  extractInfo(req.url);
  var fileString = fs.readFileSync('./public/index.html').toString('utf8');
  var commitsString = JSON.stringify(commits, null, 2);
  var edited = fileString.replace(/{{ commitFeed }}/, commitsString);
  res.writeHead(200, {contentType: 'application/html'});
  res.end(edited);
});

server.listen(3000, 'localhost', (() => {
  console.log('Starting up your server Sir!')
}))