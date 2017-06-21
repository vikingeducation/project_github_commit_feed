const http = require('http');
const fs = require('fs');
const url = require('url');

var githubWrapper = require('./github_wrapper');
var commitFeedJSON = require('../data/commits.json');

var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

var router = {};

router.serveCommitFeed = (queryParams, res) => {
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

        fs.readFile('./public/index.html', 'utf8', (err, data) => {
          if (err) return res.end(err);
          fs.readFile('./data/commits.json', 'utf8', (err, json) => {
            if (err) throw err(err);
            res.writeHead(200, _headers);
            res.end(data.replace('{{commitFeed}}', json));
          });
        });
      });
    })
    .catch(err => console.log(err));
};

router.serveIndexPage = (res) => {
  res.writeHead(200, _headers);
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) return res.end(err);
    res.end(data);
    res.end(data.replace('{{commitFeed}}', JSON.stringify(commitFeedJSON, null, 2)));
  });
};

router.serveWebhookPage = (req, res) => {
  var body = '';
  var decodedBody, webhookData, queryParams;
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    decodedBody = decodeURIComponent(body);
    webhookData = JSON.parse(decodedBody.slice(8));
    console.log(webhookData.pusher.name);
    console.log(webhookData.repository.name);
    queryParams = {
      user: webhookData.pusher.name,
      repo: webhookData.repository.name
    };
    router.serveCommitFeed(queryParams, res);
  });
};

router.handle = (req, res) => {
  //parse url, call matching function
  var queryParams, path, parsedQuery, query;
  var path = url.parse(req.url).pathname;
  console.log(path);
  if (path) {
    if (path === '/github/webhooks') {
      router.serveWebhookPage(req, res);
    } else if (path === '/commits') {
      query = url.parse(req.url).query;
      parsedQuery = query.split(/(=|&)/g);
      queryParams = {
        user: parsedQuery[2],
        repo: parsedQuery[6]
      };
      console.log(queryParams);
      router.serveCommitFeed(queryParams, res);
    } else {
      router.serveIndexPage(res);
    }
  }
};

module.exports = router;
