var GithubAPI = require('github');
var keys = require("C:/Users/Jared/Modules/Cles/items");
var fs = require('fs');

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
            var newJSON = [];
            res.data.forEach((element) => {
               var commitObj = {
                  sha: element.sha,
                  author: element.commit.author,
                  url: element.commit.url,
                  message: element.commit.message
               };
   
               newJSON.push(commitObj);
            });

            var passInJSON = (newJSON) => {
               fs.writeFile('./data/commits.json', JSON.stringify(newJSON), () => {
                  console.log('Data saved.');
               });
               return newJSON;
            
            };
            
            var result = new Promise((resolve, reject) => {
               resolve(passInJSON(newJSON));
            });
            result.then((result) => {
               console.log(`Commits.JS result: ${result}`);
               return result;
            }).catch((value) => {
               console.log(value);
            });
            
         }
   });
};


module.exports = {
   repoCommits
};