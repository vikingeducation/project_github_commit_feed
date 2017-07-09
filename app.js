var http = require('http');
var fs = require('fs');
var commits = require('./data/commits.json');

var server = http.createServer((req, res) => {
  var fileString = fs.readFileSync('./public/index.html').toString('utf8');
  var commitsString = JSON.stringify(commits, null, 2);
  var edited = fileString.replace(/{{ commitFeed }}/, commitsString);
  res.writeHead(200, {contentType: 'application/html'});
  res.end(edited);
});

server.listen(3000, 'localhost', (() => {
  console.log('Starting up your server Sir!')
}))