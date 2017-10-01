const git = require("./modules/github");

// User can insert their own api key here locally if they want to.
git.authenticate();
git.getCommits("promilo", "github-avatar-downloader").then(
  commit => console.log(commit.data[0])
)
