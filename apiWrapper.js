const token = require("./apikey");
var GithubApi = require("github");
var github = new GithubApi({});

const apiWrapper = {
	authenticate: () => {
		github.authenticate({
			type: "token",
			token: token
		});
	},

	returnCommits: (owner, repo) => {
		github.repos.getCommits({
			owner: owner,
			repo: repo
		});
	}
};

module.exports = apiWrapper;
