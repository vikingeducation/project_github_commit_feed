let Github = require("github");

let GITHUB = {
  create: () => {
    return new Github({
      debug: true,
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
      headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
      },
      // Promise: require('bluebird'),
      followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
      timeout: 5000
    });
  },

  getCommits: () => {
    Github.repos.getCommits(
      {
        owner: "gregfilipczak",
        repo: "project_github_commit_feed"
      },
      function(err, res) {
        console.log(res);
      }
    );
  }
  //
  // authenticate: Github.authenticate({
  //   type: "token",
  //   token: "userToken"
  // })
};

module.exports = GITHUB;
