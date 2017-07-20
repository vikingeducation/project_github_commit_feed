//
const user_name = "karathrash";
const repo = "project_github_commit_feed";

const git = require("./lib/github_wrapper");
git.authenticate();

git.repos(user_name, repo).then(
  message => {
    console.log(message);
  },
  err => {
    console.log(err);
  }
);
