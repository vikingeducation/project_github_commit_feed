var Github = require('github');

githubWrapper = function (ownerInput, repoInput) {
  var github = new Github({});
  // user token
  github.authenticate({
      type: "token",
      token: "c656b664db31a3b833142a0b4b0090da31ad8f24",
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
