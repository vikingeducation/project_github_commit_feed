'use strict';

//used for coveyes to verify first cert, else comment out. (most likely you do not have coveyes)
require('../coveyes/coveyes');

const GitHubApi = require('github');
const github = new GitHubApi();

let authenticate = (token) => {
	github.authenticate({
	    type: "token",
	    token: token
	});
};

//option1: using promises
let getRepoCommits = (params) => {
	let p = new Promise( (resolve, reject) => {
		github.repos.getCommits(params, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});
	});
	p.then(res => console.log(JSON.stringify(res, null, " ")))
	 .catch(err => console.log('DC promise rejected: \n' + err));
};

//option2: using callbacks
/*let getRepoCommits = (params, callback) => {
	github.repos.getCommits(params, callback);
};
*/

module.exports = {
	authenticate: authenticate,
	getRepoCommits: getRepoCommits
};
