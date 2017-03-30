const Github = require("github");
var github = new Github();

const token = process.env.GITHUB_API_KEY;
github.authenticate({
  type: "token",
  token: token
});

var github_wrapper = {};

github_wrapper.getCommits = function(info_obj, callback) {

  github.repos.getCommits(info_obj).then(function(data) {
    callback(data);
  })
}

module.exports = github_wrapper;


