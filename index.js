const getGithubCommits= require("./lib/github_wrappers");

getGithubCommits("Alex-Willenbrink", "project_github_commit_feed")
.then((res) => {
  console.log(res);
})
