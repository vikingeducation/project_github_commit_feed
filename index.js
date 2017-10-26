'use strict';

const github = require('./lib/github-wrapper');

github.authenticate(process.env.GITHUB_ACCESS_TOKEN);

let params = {
    owner: "oaksofmamre",
    repo: "assignment_building_the_express_router"
};

//option1: using promises
github.getRepoCommits(params);

//option2: using callbacks
/*github.getRepoCommits(params, (err, res) => {
	if (err) console.error(err);
	console.log(JSON.stringify(res, null, " "));
});
*/
