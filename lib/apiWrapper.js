const Github = require("github");
const token = require("../token");
const parseData = require("./parseData");

const github = new Github();

var authenticate = function() {
  github.authenticate({
    type: "token",
    token: token
  });
};

var getCommits = function(params) {
  return github.repos.getCommits({
    owner: params.username,
    repo: params.repository
  });
};

module.exports = {
  authenticate: authenticate,
  getCommits: getCommits,
  parseData: parseData
};
