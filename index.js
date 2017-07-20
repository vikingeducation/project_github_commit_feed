let Github = require("github");


let GITHUB = {

  getCommites =
  let github = new Github();

  github.repos.getCommits(
    {
      owner: "gregfilipczak",
      repo: "project_github_commit_feed"
    },
    function(err, res) {
      console.log(res);
    }
  );

  github.authenticate({
    type: "token",
    token: "userToken"
  });
}
