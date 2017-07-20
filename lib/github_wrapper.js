const Github = require("github");
var github = new Github({
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub

  headers: {
    "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
  },

  timeout: 5000
});

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

var checkAPI = function() {
  //console.log(github.foruser("karathrash"));
  github.users.getForUser(
    {
      username: "karathrash"
    },
    function(err, res) {
      //  debugger;
      console.log(res["data"]["login"] + "this is a check");
    }
  );
  //console.log(JSON.stringify(res) + "this is a check");
  //console.log(github.repos + "this is a check");
};
//git_wrap.authenticate();

git_wrap.repos = function(owner, repo) {
  let url = base_url + "/repos" + owner + repo;
  github.repos.getCommits(
    {
      owner: "karathrash",
      repo: "project_github_commit_feed"
    },
    function(err, res) {
      debugger;
      //res["data"] this is an array

      console.log(res["data"][0]["commit"]);
    }
  );
};
git_wrap.repos();
//check users

module.exports = git_wrap;
