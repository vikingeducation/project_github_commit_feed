const GitHubApi = require("github");
const GITHUB_API_KEY = require('./config.json').token;


let wrapper = {};

wrapper.init = () => {
	let github = new GitHubApi();
	return github;
};

wrapper.authenticate = (github) => {
	github.authenticate({
    type: "token",
    token: GITHUB_API_KEY
  });
};

wrapper.getCommits = (github, username, repo) => {
	github.repos.getCommits({
  	owner: username, 
  	repo: repo
	}, function(err, res) {
  	if (err) console.log(err);
  	else console.log(JSON.stringify(res, null , "  "));
	});
};

module.exports = wrapper;
