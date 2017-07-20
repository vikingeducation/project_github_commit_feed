const Github = require("github");
const fs = require("fs");

//git_wrap is our exported module
let git_wrap = {};
let base_url = "api.github.com";

//initialize the github api library
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

///authentication
git_wrap.authenticate = function() {
  const my_token = fs.readFileSync("./tokens.txt");
  github.authenticate({
    type: "token",
    token: my_token
  });
};
git_wrap.authenticate();
///check repos
/* /repos/:owner/:repo/commits */

//Do the API call for repo data
//git_wrap.repos will return a promise (it'll get you data later, I SWEAR IT)
git_wrap.repos = function(params) {
  //make a promise
  let repos_promise = new Promise((resolve, reject) => {
    //our api call
    github.repos.getCommits(
      {
        owner: params["user"],
        repo: params["repo"]
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
