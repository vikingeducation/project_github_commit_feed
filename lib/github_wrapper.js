var Github = require('github');

githubWrapper = function (ownerInput, repoInput) {
  var github = new Github({});
  // user token
  github.authenticate({
      type: "token",
      token: "oathtoken here",
  });

  github.repos.getCommits({owner: ownerInput, repo:repoInput}, function(err,res) {
    if (err) {
      return console.log(err);
    }
    else {
     console.log(res);
   }
  });
}

module.exports = githubWrapper;
