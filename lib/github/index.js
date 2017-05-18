const GithubAPI = require('github');

let github;
let GitHubWrapper = {};

GitHubWrapper.init = () => {
  github = new GithubAPI();
};

GitHubWrapper.authenticate = (userToken) => {
  github.authenticate({
    type: "token",
    token: userToken || process.env.GITHUB_API_KEY
  });
};

GitHubWrapper.getRepoCommits = (username, repo, callback) => {
  github.repos.getCommits({
    owner: username,
    repo: repo
  }, callback);
};

module.exports = GitHubWrapper;

