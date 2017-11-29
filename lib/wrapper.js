const commits = require('./commits');

var owner = 'jaredjgebel';
var repo = 'assignment_githuh'

var githubRepoCommits = (owner, repo) => {
   commits.repoCommits(owner, repo);
};

githubRepoCommits(owner, repo);

