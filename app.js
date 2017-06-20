const http = require('http');
const fs = require('fs');
const url = require('url');
var githubWrapper = require('./lib/github_wrapper');
var commitFeedJSON = require('./data/commits.json');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  var queryParams, path, parsedQuery;
  var path = url.parse(req.url).query;

  parsedQuery = path.split(/(=|&)/g);
  queryParams = {
    user: parsedQuery[2],
    repo: parsedQuery[6]
  };
  console.log(queryParams);

  githubWrapper.getCommits(queryParams.user, queryParams.repo)
    .then( data => {
      var formattedCommitData = data.data.map(function(commit) {
        var formattedCommit = {};
        formattedCommit.author = commit.commit.author;
        formattedCommit.message = commit.commit.message;
        formattedCommit.html_url = commit.html_url;
        formattedCommit.sha = commit.sha;
        return formattedCommit;
      });
      console.log(JSON.stringify(formattedCommitData));
      fs.writeFile('./data/commits.json', JSON.stringify(formattedCommitData), (err) => {
        if (err) throw err;
        console.log('Commit file updated');
      });
    })
    .catch(err => console.log(err));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('public/index.html', 'utf8', (err, data) => {
    if (err) return res.end(err);
    res.end(data.replace('{{commitFeed}}', JSON.stringify(commitFeedJSON, null, 2)));
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
