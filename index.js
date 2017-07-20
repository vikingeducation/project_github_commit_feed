const Github = require("github");

const github = new Github();

github.authenticate({
  type: "token",
  token: "32fcf0a1da80eb404cd704aaa5b6c6d490cf991c"
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
