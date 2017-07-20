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
    token: "4a2c733e72f3271985456f4d8fd7e12fac55844e"
  });
};
//git_wrap.authenticate();
///check repos
/* /repos/:owner/:repo/commits */

//git_wrap.repos will return a promise (it'll get you data later, I SWEAR IT)
git_wrap.repos = function(new_owner, new_repo) {
  //make a promise
  let repos_promise = new Promise((resolve, reject) => {
    //our api call
    github.repos.getCommits(
      {
        owner: new_owner,
        repo: new_repo
      },
      function(err, res) {
        if (err) {
          reject(err);
        }
        let repos_jobj = [];
        for (var i = 0; i < res["data"].length; i++) {
          repos_jobj.push(res["data"][i]["commit"]);
        }
        resolve(repos_jobj);
      }
    );
  });
  return repos_promise;
};

//check users

module.exports = git_wrap;
