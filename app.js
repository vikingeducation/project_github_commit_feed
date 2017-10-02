const wrapper = require('./gitHubApiWrapper');

let github = wrapper.init();

wrapper.authenticate(github);
wrapper.getCommits(github, "maddiereddy", "project_what_have_you_done");


// const GitHubApi = require("github");
// const GITHUB_API_KEY = require('./config.json').token;

// let github = new GitHubApi();

// github.authenticate({
//     type: "token",
//     token: GITHUB_API_KEY
// });

// github.repos.getCommits({
//   owner: "maddiereddy", 
//   repo: "project_what_have_you_done"
// }, function(err, res) {
//   if (err) console.log(err);
//   else console.log(JSON.stringify(res, null , "  "));
// });