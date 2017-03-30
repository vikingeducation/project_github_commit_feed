const Github = require("github");
var github = new Github();

const token = process.env.GITHUB_API_KEY;

var commits = github.repos.getCommits({
  owner: "William-Charles",
  repo: "assignment_node_dictionary_reader"
});

console.log(commits);

var gitToken = github.authenticate({
  type: "token",
  token: "userToken"
});
