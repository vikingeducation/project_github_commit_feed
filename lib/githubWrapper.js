var Github = require('github');
const fs = require('fs');

const github = new Github();

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

function getCommits(userInfo) {
  return github.repos
    .getCommits(userInfo)
    .then(function(res) {
      let scrubbedData = scrubData(res);
      //let stringifiedData = JSON.stringify(scrubbedData, null, 2);
      // console.log(scrubbedData);
      return readFilePromise('./data/commits.json', scrubbedData);
    })
    .then(function(fileDataAndStringifiedData) {
      return writeFilePromise(
        './data/commits.json',
        fileDataAndStringifiedData
      );
    });
  // .then(function() {
  //   return new Promise(function(resolve, reject) {
  //     return resolve(stringifiedData);
  //   });
  // });
}
// return github.repos.getCommits(userInfo);

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

function readFilePromise(path, scrubbedData) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, data) {
      data = JSON.parse(data);
      scrubbedData = scrubbedData.concat(data.data);
      let dataObj = { data: scrubbedData };
      dataObj = JSON.stringify(dataObj);
      return resolve(dataObj);
    });
  });
}

function writeFilePromise(path, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, 'utf8', function(err) {
      return resolve();
    });
  });
}
