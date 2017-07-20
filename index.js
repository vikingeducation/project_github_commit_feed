let Github = require("github");

let github = new Github();

github.repos.getCommits({ owner: "gregfilipczak", repo: "" });

github.authenticate({
  type: "token",
  token: "793358e3f98ea0a1dfa00a5136adef8f9c96db98"
});
