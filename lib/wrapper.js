const commits = require('./commits');

// test variables
// var owner = 'jaredjgebel';
// var repo = 'assignment_githuh';

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

// githubRepoCommits.getCommits(owner, repo);

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
