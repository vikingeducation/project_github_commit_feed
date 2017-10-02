var GitHubApi = require("github");
const GITHUB_API_KEY = require('./config.json').token;

var github = new GitHubApi({});

// TODO: optional authentication here depending on desired endpoints. See below in README.
// user token
github.authenticate({
    type: "token",
    token: GITHUB_API_KEY
});

github.repos.getCommits({
    owner: "maddiereddy", 
    repo: "assignment_building_the_express_router"
}, function(err, res) {
    console.log(JSON.stringify(res, null , "  "));
});