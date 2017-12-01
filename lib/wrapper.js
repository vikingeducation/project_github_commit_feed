const commits = require('./commits');

// test variables
// var owner = 'jaredjgebel';
// var repo = 'assignment_githuh'

var githubRepoCommits = (owner, repo) => {
   commits.repoCommits(owner, repo);
};

//githubRepoCommits(owner, repo);

module.exports = {
  githubRepoCommits 
}
