require('dotenv').config();
const Github = require('github');
const fs = require('fs');

let githubWrapper = {};
let github;

githubWrapper.init = () => {
    github = new Github;
}

githubWrapper.authenticate = () => {
    github.authenticate({
        type: "token",
        token: process.env.GITHUB_TOKEN
    });
}

githubWrapper.getCommits = (user, repoName, callback) => {
    github.repos.getCommits({
        owner: user,
        repo: repoName
    }, callback);
}

module.exports = githubWrapper;
