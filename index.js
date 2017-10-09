const git = require("./modules/github");

// User can insert their own api key here locally if they want to.

var gitModule = (user, repo) => {
  var data
  console.log("i am being called")
  git.authenticate();
  git.getCommits(user, repo).then(
    // commit => console.log(commit.data[0])
    commit => data = commit.data
  )
  var getData = () => {
    return data
  }
}

module.exports = gitModule
