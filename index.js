var github = require("./lib/github");
fs = require("fs");

console.log(github.githubCommits('GeneTinderholm', 'project_github_commit_feed'));
/*  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
*/