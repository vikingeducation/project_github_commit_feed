var Github = require("github");
var github = new Github();
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

/*gitHubObj.githubCommits('GeneTinderholm', 'project_github_commit_feed')
  .then(data => {console.log(data)})
  .catch(err => {console.error(err)});
*/
/*let x = github.repos.getCommits({owner:'GeneTinderholm', repo:'project_github_commit_feed'})
x
    .then(data =>{console.log(data)})
  .catch(err => {console.error(err)});
  */
