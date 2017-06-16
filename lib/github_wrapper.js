var Github = require('github');
var constants = require('./constants');

var wrapper = {};

github = new Github({
  debug: true,
  host: "api.github.com"
});

github.authenticate({
  type: "token",
  token: constants.USER_TOKEN
});

github.repos.getCommits({
  owner: "tketron",
  repo: "assignment_building_the_express_router"
}, function(err, res) {
  console.log(res);
});
