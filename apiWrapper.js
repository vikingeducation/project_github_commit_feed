const token = require("./apikey");
var GithubApi = require("github");

var github = new GithubApi({});

module.exports = github;
