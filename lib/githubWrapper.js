const Github = require('github');
const fs = require('fs');
const {
  readFilePromise,
  writeFilePromise
} = require('./file_helpers');

const github = new Github();

process.env.GITHUB_API_KEY = '4dda2cbbb67bf5af413c366ec9de10135302d38c';

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

function getCommits(userInfo) {
  return github.repos.getCommits(userInfo)
    .then(function(res) {
      let scrubbedData = scrubData(res);
      return readFilePromise('./data/commits.json', scrubbedData);
    })
    .then(function(fileDataAndStringifiedData) {
      return writeFilePromise('./data/commits.json', fileDataAndStringifiedData);
    });
}


function setUserInfo(username, userRepo) {
  return { owner: username, repo: userRepo };
}

function scrubData(jsonObj) {
  let data = jsonObj.data;
  let scrubbedData = data.map(function(individualCommit) {
    let simplifiedCommit = {};
    simplifiedCommit.message = individualCommit.commit.message;
    simplifiedCommit.author = individualCommit.commit.author;
    simplifiedCommit.url = individualCommit.commit.url;
    simplifiedCommit.sha = individualCommit.sha;
    return simplifiedCommit;
  });

  return scrubbedData;
}

module.exports = {
  setUserInfo: setUserInfo,
  getCommits: getCommits
};

