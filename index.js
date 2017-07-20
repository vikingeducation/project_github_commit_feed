const Github = require("github");
const token = require("./token.js");

const github = new Github();

github.authenticate({
  type: "token",
  token: token,
});

var commits = github.repos
  .getCommits({
    owner: "idhalverson",
    repo: "assignment_building_the_express_router"
  })
  .then(resolve => {
    resolve.data.forEach(commit => {
      console.log(commit.commit);
    });
  });
