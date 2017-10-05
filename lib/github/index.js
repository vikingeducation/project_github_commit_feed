const config = require('../../config');
const GithubApi = require('github');

const baseUri = 'https://api.github.com/users';
const github = new GithubApi();

class GithubApiWrapper {
  constructor() {
    github.authenticate({
      type: 'token',
      token: config.GITHUB_API_KEY
    });
  };
  getCommits(user, repo, callback) {
    github.repos.getCommits({
      owner: user,
      repo: repo
    }, function(err, res) {
      if (err) throw err;
      callback(res);
    });
  }
}

module.exports = GithubApiWrapper;
