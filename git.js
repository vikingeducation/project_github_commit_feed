var Github = require("github");
var github = new Github();

let x = github.repos.getCommits({owner:'GeneTinderholm', repo:'project_github_commit_feed'})
x.then(data =>{console.log(data)})
  .catch(err => {console.error(err)});