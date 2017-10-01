const Github = require('github');
const env = require('node-env-file');
require('dotenv').config();

var github

githubModule = {
  authenticate: token => {
    github = new Github()
    github.authenticate({

      type: "token",
      token: token || process.env.TOKEN
    })
  },
  getCommits: (owner, repo) => {
      var commits = github.repos.getCommits({
        owner: owner,
        repo: repo
      })
      return commits;
  }
}
//
//
// var github = new Github()
// github.authenticate({
//   type:'token',
//   token: process.env.TOKEN
// })
// var getCommits = github.repos.getCommits({
//   owner: "promilo",
//   repo: "github-avatar-downloader"
// })
//
//
//
// getCommits.then( commit => {
//   console.log(commit)
// })


module.exports = githubModule;
