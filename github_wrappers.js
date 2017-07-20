const Github = require('github');
require('dotenv').config()

//console.log(process.env.GITHUB_TOKEN);

const github = new Github();

// synchronous - don't worry about it
github.authenticate({type: "token", token: process.env.GITHUB_TOKEN});

module.exports = function getGithubCommits(githubUser, repo) {
  return new Promise((resolve, reject) => {
    github.repos.getCommits({
      owner: githubUser,
      repo: repo
    }, (err, res) => {
      if (err)
        console.error(err);
      resolve(res);
    })
  });
}
