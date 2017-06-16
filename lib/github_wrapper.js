var Github = require('github');

const USER_TOKEN = '0cf9c92e27be7efd7d8be9f18473063a4c441c25';

var github = new Github({
  debug: true,
  host: "api.github.com"
});

github.authenticate({
  type: "token",
  token: USER_TOKEN
});

github.repos.getCommits({
  owner: "tketron",
  repo: "assignment_building_the_express_router"
}, function(err, res) {
  console.log(res);
});
