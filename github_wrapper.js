'use strict';
const GitHub = require('github');

let github = new GitHub({
  debug: true,
  headers: {
    'user-agent': 'Chrome',
  }
});

function gitHubWrapper(userName, repoName) {

  github.authenticate({
    type: 'oauth',
    key: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  });

  let formData = {
    owner: userName,
    repo: repoName
  }

  let responseCommits = new Promise( (resolve, reject) => {
    github.repos.getCommits( formData, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });

  return responseCommits;

}


// console.log( gitHubWrapper('visiona', 'assignment_githuh') );

module.exports = gitHubWrapper;
