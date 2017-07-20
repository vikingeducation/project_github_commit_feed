const Github = require("github");
const token = require("./token");
const parseData = require("./parseData");

const github = new Github();

var getCommits = function() {
  github.authenticate({
    type: "token",
    token: token
  });

  var p = github.repos.getCommits({
    owner: "idhalverson",
    repo: "assignment_building_the_express_router"
  });
  return p;
};

module.exports = { getCommits: getCommits, parseData: parseData };
