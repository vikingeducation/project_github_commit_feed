var Github = require("github");
var github = Github();
fs = require("fs");

var token = fs.readFileSync("./accessToken", "utf8", (err, data) => {
  if (err) {
    throw err;
  } else {
    return data;
  }
});
github.authenticate({
  type: "token",
  token: token
});

let gitHubObj = {
  githubActivity: (username, repo) => {
    return github.activity.getEventsForRepo({
      owner: username,
      repo: repo
    });
  },
  githubCommits: (username, repo) => {
    return github.repos.getCommits({
      owner: username,
      repo: repo
    });
  }
};

module.exports = gitHubObj;
