const ghtoken = require("./apikey");
var GithubApi = require("github");
var github = new GithubApi();

const apiWrapper = {
	auth: () => {
		github.authenticate({
			type: "token",
			token: ghtoken
		});
	},

	returnCommits: (owner, repo) => {
		return github.repos.getCommits({
			owner: owner,
			repo: repo
		});
	}
};

module.exports = apiWrapper;
