const Github = require('github');
require('dotenv').config();

//console.log(process.env.GITHUB_TOKEN);

const github = new Github();

// synchronous - don't worry about it
github.authenticate({type: "token", token: process.env.GITHUB_TOKEN});

module.exports = function getGithubCommits(githubObject) {
  return new Promise((resolve, reject) => {
    github.repos.getCommits({
      owner: githubObject.username,
      repo: githubObject.repo
    }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });
}
