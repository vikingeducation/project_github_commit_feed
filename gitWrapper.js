const Github = require('github');
let github = new Github();

github.authenticate({
  type: "token";
  token: process.env.GITHUB_API_KEY;
})

let test = github.repos.getCommits({
  // owner: 'blackwright',
  owner: 'markmarkyesyes',
  repo: 'project_github_commit_feed'
})

console.log(test);