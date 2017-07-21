const Github = require('github');
require('dotenv').config();

//console.log(process.env.GITHUB_TOKEN);

const github = new Github();

// synchronous - don't worry about it
github.authenticate({type: "token", token: process.env.GITHUB_TOKEN});

module.exports = {
  getGithubCommits: (githubObject) => {
    return new Promise((resolve, reject) => {
      if(Object.keys(githubObject).length < 1) resolve({});
      github.repos.getCommits({
        owner: githubObject.username,
        repo: githubObject.repo
      }, (err, res) => {
        if (err)
          reject(err);
        resolve(makeGithubArray(res));
      });
    })
  },

  makeGithubArray: (commitObject) => {
    return commitObject = commitObject.data.map((ele) => {
      return gitCommitObject = {
        sha: ele.sha,
        commit: ele.commit,
        author: ele.author.login,
        htmlURL: ele.html_url
      };
    })
  }
}
