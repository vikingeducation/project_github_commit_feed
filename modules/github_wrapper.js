//require('dotenv/config');
const Github = require('github');
const fs = require('fs');



let github = new Github();

github.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN
});


let commits = github.repos.getCommits({
    owner: 'malbaron0',
    repo: 'assignment_building_the_express_router'
});

commits.then((res) => {
    console.log(res);
});