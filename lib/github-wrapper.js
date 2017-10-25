'use strict';

//used for coveyes to verify first certificate, else comment out. (most likely you do not have coveyes)
require('../coveyes/coveyes');

const GitHubApi = require('github');
const github = new GitHubApi();

let authenticate = (token) => {
	github.authenticate({
	    type: "token",
	    token: token
	});
};

let getRepoCommits = (params) => {
	return new Promise( (resolve, reject) => {
		github.repos.getCommits(params, (err, result) => { 
			if (err) reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	authenticate: authenticate,
	getRepoCommits: getRepoCommits
};
