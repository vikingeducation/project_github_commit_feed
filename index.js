var github = require("./lib/github");
fs = require("fs");

var commits = github.githubCommits(
  "GeneTinderholm",
  "project_github_commit_feed"
);
commits
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
