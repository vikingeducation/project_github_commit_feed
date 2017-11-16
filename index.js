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
console.log(token);
console.log(github.authenticate({ type: "token", token: token }));

github.activity
  .getEventsForRepo({
    owner: "SamuelLangenfeld",
    repo: "project_github_commit_feed"
  })
  .then(data => {
    console.log(data);
  });
