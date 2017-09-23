const GitHubApi = require("./lib/github_api_wrapper");

// enable env variable storage for github API key
require('dotenv').config();

var github = GitHubApi();

github.authenticate(process.env.GITHUB_TOKEN);

var commits = github.getCommits({
  owner: 'asaloff',
  repo: 'tealeaf-intro-to-programming'
});

commits.then((output) => {
  var messages = [];
  for (var i = output.length - 1; i >= 0; i--) {
    messages.push(output[i].commit.message);
  }

  messages.forEach((message) => {
    console.log(message);
  });
}).catch((res) => {
  console.error(`Responded with CODE: ${ res.statusCode }, MESSAGE: ${ res.statusMessage }`);
});



