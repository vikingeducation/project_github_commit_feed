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
    return new Promise((resolve, reject) => {
      return resolve(scrubbedData);
    });
  });
  // return github.repos.getCommits(userInfo);
}

function setUserInfo(username, userRepo) {
  return { owner: username, repo: userRepo };
}

function scrubData(jsonObj) {
  let data = jsonObj.data;
  let scrubbedData = data.map(function(individualCommit){
    let simplifiedCommit = {};
    simplifiedCommit.message = individualCommit.commit.message;
    simplifiedCommit.author = individualCommit.commit.author;
    simplifiedCommit.url = individualCommit.commit.url;
    simplifiedCommit.sha = individualCommit.sha;
    return simplifiedCommit;
  });

  return {data: scrubbedData};
}

module.exports = {
  setUserInfo: setUserInfo,
  getCommits: getCommits
};
