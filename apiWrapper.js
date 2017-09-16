const token = require("./apikey");
var GithubApi = require("github");
var github = new GithubApi({});

github.authenticate({
	type: "token",
	token: token
});

const apiWrapper = {
	returnCommits: (owner, repo) => {
		github.repos.getCommits({
			owner: owner,
			repo: repo
		});
	}
};

module.exports = apiWrapper;
