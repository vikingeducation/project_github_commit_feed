var Github = require('github');

const github = new Github();

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

function getCommits(userInfo) {
  let commits = github.repos.getCommits(userInfo);

  commits.then(function(res) {
    console.log(res);
  });
}

function setUserInfo(username, userRepo) {
  return { owner: username, repo: userRepo };
}

module.exports = {
  setUserInfo: setUserInfo,
  getCommits: getCommits
};
