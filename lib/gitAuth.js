const Github = require('github');
const github = new Github();
const ghToken = process.env.GITHUB_API_KEY;

github.authenticate({
  type: "token",
  token: ghToken
});

module.exports = github;
