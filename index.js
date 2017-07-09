var GithubApi = require('github');
var secrets = require("./secrets.json")

var github = new GithubApi({
  // optional
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  headers: {
      "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
  },
  timeout: 5000
});

github.authenticate({
    type: "token",
    token: secrets.github,
});

var commits = github.repos.getCommits({
  owner: 'tgturner',
  repo: 'kithub'
});

commits.then((data) => {
  console.log(data)
})