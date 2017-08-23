var Github = require('github');
var fs = require('fs');
var routes = require('../modules/routes');

githubWrapper = function (ownerInput, repoInput, callback) {
  var github = new Github({});
  // user token
  github.authenticate({
      type: "token",
      token: "oauth token",
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
     fs.writeFile('./data/commits.json', JSON.stringify(res, null, 2), function(err){
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
