var Github = require('github');

const github = new Github();

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

function getCommits(userInfo) {
  let commits = github.repos.getCommits(userInfo);

  return commits.then(function(res) {
    let scrubbedData = scrubData(res);
    // Here we could process 'res' before returning a new Promise with it
    return new Promise((resolve, reject) => {
      return resolve(res);
    });
  });
  //return github.repos.getCommits(userInfo);
}

function setUserInfo(username, userRepo) {
  return { owner: username, repo: userRepo };
}

function scrubData(data) {
  let scrubbedData = arr.map(callback[, thisArg])

  return scrubbedData;
}

module.exports = {
  setUserInfo: setUserInfo,
  getCommits: getCommits
};
