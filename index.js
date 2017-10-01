var Github = require('github');
var env = require('node-env-file');
require('dotenv').config();
var github = new Github()
github.authenticate({
  type:'token',
  token: process.env.TOKEN
})
var getCommits = github.repos.getCommits({
  owner: "promilo",
  repo: "github-avatar-downloader"
})

getCommits.then( commit => {
  console.log(commit)
})
