var Github = require('github');

const github = new Github();

github.authenticate({
    type: "token",
    token: process.env.GITHUB_API_KEY,
});

let repoInfo = {
	owner: 'nicoasp',
	repo: 'TOP---Ruby-Final-Project'
}

let commits = github.repos.getCommits(repoInfo);

commits.then(function(res){
	console.log(res);
})