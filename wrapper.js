let Github = require("github");

const github = new Github({ debug: true });

module.exports = {
  authenticateWithToken(token) {
    github.authenticate({
      type: "token",
      token: "userToken"
    });
  },

  getCommits() {
    github.repos.getCommits(
      {
        owner: "gregfilipczak",
        repo: "project_github_commit_feed"
      },
      function(err, res) {
        console.log(res);
      }
    );
  }
};
