const GithubApiWrapper = require('./lib/github');

const github = new GithubApiWrapper();

github.getCommits(user, repo, function(res) {
  console.log(res);
});
