var github = require("./lib/github");
fs = require("fs");
var http = require('http');

var commits = github.githubCommits(
  "GeneTinderholm",
  "project_github_commit_feed"
);

var server = http.createServer((req, res){
  
});

commits
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
var appObj;
module.exports = appObj;
