const config = require('../../config');
const Github = require('github');

const github = new Github();

function _parser(user, repo, res) {
  const results = { [user]: {} };
  results[user][repo] = [];
  const commitArr = [];
  const commits = res.data;
  commits.forEach((commit) => {
    const entry = {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author,
      url: commit.url
    };
    results[user][repo].push(entry);
    commitArr.push(entry);
  });
  return ({ results, commitArr });
}

class GithubApiWrapper {
  constructor() {
    github.authenticate({
      type: 'token',
      token: config.GITHUB_API_KEY
    });
  }
  getCommits(user, repo, callback) {
    github.repos.getCommits({
      owner: user,
      repo: repo,
      per_page: 100
    }, (err, res) => {
      if (err) throw err;
      const { results, commitArr } = _parser(user, repo, res);
      callback(results, commitArr);
    });
  }
}

module.exports = GithubApiWrapper;
