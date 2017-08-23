var Github = require('github');
var fs = require('fs');
var routes = require('../modules/routes');

githubWrapper = function (ownerInput, repoInput, callback) {
  var github = new Github({});
  // user token
  github.authenticate({
      type: "token",
      token: "oauthtoken",
  });

  github.repos.getCommits({owner: ownerInput, repo: repoInput}, function(err,res) {
    if (err) {
      fs.writeFile('./data/commits.json', 'Username or repo incorrect', function(err2){
        if (err2) {
          throw (err2);
        }
        else {
          callback();
        }
      })
    }
    else {
      var filterCommits = {};
      for (var i = 0; i < res.data.length; i++) {
        filterCommits[i] = res.data[i].commit.message + " | " + res.data[i].commit.author.name + " | " + res.data[i].html_url + " | " + res.data[i].sha;
      }
     fs.writeFile('./data/commits.json', JSON.stringify(filterCommits, null, 2), function(err){
       if (err) {
         throw (err);
       }
       else {
         callback();
       }
     })
   }
 });
}

module.exports = githubWrapper;
