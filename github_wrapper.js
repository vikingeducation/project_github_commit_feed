const Github = require("github");
var github = new Github();

const token = process.env.GITHUB_API_KEY;
github.authenticate({
  type: "token",
  token: token
});

var github_wrapper = {};

github_wrapper.getCommits = function(info_obj, callback) {
  github.repos.getCommits(info_obj).then(function(data) {
    data = scrubTheData(data);
    callback(data);
  });
};

function scrubTheData(data) {
  let scrubArray = [];
  let commitsArray = data.data;
  commitsArray.forEach(commit => {
    let scrubObj = {};
    scrubObj.sha = commit.sha;
    scrubObj.commit_message = commit.commit.message;
    scrubObj.author = commit.commit.author;
    scrubObj.html_url = commit.html_url;
    scrubArray.push(scrubObj);
  });
  return scrubArray;
}

module.exports = github_wrapper;
