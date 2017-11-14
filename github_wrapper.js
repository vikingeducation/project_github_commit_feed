'use strict';
const GitHub = require('github');

let github = new GitHub({
  debug: true,
  headers: {
    'user-agent': 'Chrome',
    'owner': 'visiona'
  },
});

function gitHubWrapper(userName, repoName) {

  github.authenticate({
    type: 'oauth',
    key: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  });

  let formData = {
    username: userName,
    repo: repoName
  }

  let responseCommits = new Promise( (resolve, reject) => {
    github.repos.getCommits({
      username: userName,
      repo: repoName
    }, (err, res) => {
      debugger;
      if (err) reject(err);
      resolve(res);
    })
  });

  return responseCommits;

}


console.log( gitHubWrapper('visiona', 'assignment_githuh') );

module.exports = gitHubWrapper;
