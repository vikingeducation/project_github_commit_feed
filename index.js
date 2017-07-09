var wrapper = require('./lib/github_wrapper');

var commits = wrapper.getCommits('tgturner', 'kithub');

commits.then((data) => {
  console.log(data)
});