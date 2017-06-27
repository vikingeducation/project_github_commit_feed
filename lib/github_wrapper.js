var Github = require('github');
var constants = require('./constants');

var wrapper = {};

wrapper.github = new Github({
  debug: true,
  host: "api.github.com"
});

wrapper.github.authenticate({
  type: "token",
  token: constants.USER_TOKEN
});

wrapper.getCommits = function(username, repository) {
  return new Promise(function(resolve, reject) {
    wrapper.github.repos.getCommits({
      owner: username,
      repo: repository
    }, function(err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

module.exports = wrapper;
