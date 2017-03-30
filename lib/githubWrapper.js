var Github = require('github');
const fs = require('fs');

const github = new Github();

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

function getCommits(userInfo) {
  return github.repos.getCommits(userInfo)
    .then(function(res) {
      let scrubbedData = scrubData(res);
      let stringifiedData = JSON.stringify(scrubbedData, null, 2);
      return readFilePromise('../data/commits.json')
    })
    .then(function(fileData){
      return writeFilePromise('../data/commits.json', 'hello')
    })
    .then(function(){
      return resolve(stringifiedData);
    })
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

  return { data: scrubbedData };
}

module.exports = {
  setUserInfo: setUserInfo,
  getCommits: getCommits
};

function readFilePromise(path) {
  return new Promise(function(resolve, reject){
    fs.readFile(path, 'utf8', function(data) {
      return resolve(data);
    });
  });
}

function writeFilePromise(path, data) {
  return new Promise(function(resolve, reject){
    fs.writeFile(path, data, 'utf8', function(data) {
      return resolve();
    });
  });
}


