const commits = require('./commits');

// test variables
var owner = 'jaredjgebel';
var repo = 'assignment_node_dictionary_reader';

var githubRepoCommits = (owner, repo) => {
   return new Promise((resolve, reject) => {
      resolve(commits.repoCommits(owner, repo));
   }).then((result) => {
      console.log(`Wrapper.JS result: ${result}`);
      return result;
   });
   
};

var thing = githubRepoCommits(owner, repo);
console.log(thing);

module.exports = {
  githubRepoCommits 
}
