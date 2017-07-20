const Github = require('github');
const token = require('../../token');

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

  let responsePromise = new Promise((resolve, reject) => {
    github.repos.getCommits(requestOptions, (err, res) => {
      if (err) {
        reject(err); 
      }

      let commits = _parseResponseObject(res);

      resolve(commits);
    });
  })

  return responsePromise;
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
