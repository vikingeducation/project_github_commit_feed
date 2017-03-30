const Github = require('github');
const github = new Github();
const ghToken = process.env.GITHUB_API_KEY;

github.authenticate({
  type: "token",
  token: ghToken
})

let test = github.repos.getCommits({
  owner: 'markmarkyesyes',
  repo: 'project_github_commit_feed'
})

test.then( data => console.log(data));
