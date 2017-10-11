const Github = require('github');
const github = new Github();
const userToken = require('../config.js');


github.authenticate({
  type: 'token',
  token: userToken.token,
});

const githubAPIWrapper = {
  getCommits: (username, repoName) => {
    return github.repos.getCommits({
      owner: username,
      repo: repoName,
    });
  },
}



module.exports = githubAPIWrapper;
