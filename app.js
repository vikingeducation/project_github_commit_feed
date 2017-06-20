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
  if (path) {
    parsedQuery = path.split(/(=|&)/g);
    queryParams = {
      user: parsedQuery[2],
      repo: parsedQuery[6]
    };

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

        fs.writeFile('./data/commits.json', JSON.stringify(formattedCommitData, null, 2), (err) => {
          if (err) throw err;
          console.log('Commit file updated');

          fs.readFile('public/index.html', 'utf8', (err, data) => {
            if (err) return res.end(err);
            fs.readFile('./data/commits.json', 'utf8', (err, json) => {
              if (err) throw err(err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(data.replace('{{commitFeed}}', json));
            });
          });
        });
      })
      .catch(err => console.log(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('public/index.html', 'utf8', (err, data) => {
      if (err) return res.end(err);
      res.end(data);
      res.end(data.replace('{{commitFeed}}', JSON.stringify(commitFeedJSON, null, 2)));
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
