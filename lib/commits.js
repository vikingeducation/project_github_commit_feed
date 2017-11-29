var GithubAPI = require('github');
var keys = require("C:/Users/Jared/Modules/Cles/items");

var repoCommits = (owner, repo) => {
   var github = new GithubAPI({});
   
   github.authenticate({
      type: 'token',
      token: keys.github
   });
   
   github.repos.getCommits({
      owner: owner, 
      repo: repo
   }, (err, res) => {
      if (err) {
         console.error(err);
      } else {
         console.log(res);
      }
   });
};


module.exports = {
   repoCommits
};