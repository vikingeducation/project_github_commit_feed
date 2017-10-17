'use strict';

//used for coveyes to verify first cert, else comment out. (most likely you do not have coveyes)
require('./coveyes/coveyes');

const GitHubApi = require('github');
const github = new GitHubApi();

github.authenticate({
    type: "token",
    token: process.env.GITHUB_ACCESS_TOKEN
});

let params = {
    owner: "oaksofmamre",
    repo: "assignment_building_the_express_router"
};

github.repos.getCommits(params, (err, res) => {
    if (err) console.error(err);
    console.log(JSON.stringify(res, null, " "));
    // console.log(res);
});
