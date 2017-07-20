const github = require("github");

let git_wrap = {};
let base_url = "api.github.com";

///authentication
git_wrap.authenticate = function() {
  github.authenticate({
    type: "token",
    token: "userToken"
  });
};
///check repos
/* /repos/:owner/:repo/commits */
git_wrap.repos = function(owner, repo) {
  let url = "/repos";
  return github.repos.getCommits(url);
};

//check users

module.exports = git_wrap;
