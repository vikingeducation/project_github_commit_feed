let Github = require("github");

const github = new Github({ debug: true });

module.exports = {
  authenticateWithToken(token) {
    github.authenticate({
      type: "token",
      token: "userToken"
    });
  },

  getCommits(uname, rep) {
    github.repos.getCommits(
      {
        owner: uname,
        repo: rep
      },
      function(err, res) {
        console.log(JSON.stringify(res));
      }

    );
  }
};
