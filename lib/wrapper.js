const commits = require('./commits');
var githubRepoCommits = {
  getCommits: (owner, repo) => {
    return new Promise((resolve, reject) => {
        commits.repoCommits(owner, repo, (err, output) => {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        })
     }); 
  }
};

// test variables
// var owner = 'jaredjgebel';
// var repo = 'assignment_node_dictionary_reader';

// githubRepoCommits.getCommits = (owner, repo) => {
//   return new Promise((resolve, reject) => {
//       commits.repoCommits(owner, repo, (err, output) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(output);
//         }
//       })
//    }); 
// };

module.exports = {
  githubRepoCommits
}
