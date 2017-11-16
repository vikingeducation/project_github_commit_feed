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
githubActivity : (username, repo) => {
  github.activity
  .getEventsForRepo({
    owner: username, 
    repo: repo
      })
  .then(data => {
    console.log(data);
  })
  .catch(err =>{
    console.error(err);
  });
},
githubCommits : (username, repo) => {
  github.repos.getCommits({
    owner: username,
    repo: repo
  });
}
}
  
module.exports = gitHubObj;