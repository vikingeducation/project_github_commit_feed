const Github = require('github');
const token = require('../../tokens');

const githubOptions = {
  // Put options here, if needed
};
let github = new Github(githubOptions);

function githubWrapper(repo, username) {
  github.authenticate(token);

  let requestOptions = {
    repo: repo,
    owner: username
  };
  github.repos.getCommits(requestOptions, (err, res) => {
    if (err) throw err;
    let commits = _parseResponseObject(res);
    console.log(commits);
  });
}

function _parseResponseObject(res) {
  commits = [];
  res.data.forEach(commit => {
    let ourCommit = {
      sha: commit.sha,
      author: commit.commit.author,
      url: commit.url
    };
    commits.push(ourCommit);
  });
  return commits;
}

module.exports = githubWrapper;
