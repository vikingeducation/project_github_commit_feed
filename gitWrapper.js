const Github = require('github');
let github = new Github();
const token = process.env.GITHUB_API_KEY
console.log(token)
// github.authenticate({
//   type: "token",
// })

// let test = github.repos.getCommits({
//   owner: 'markmarkyesyes',
//   repo: 'project_github_commit_feed'
// })

// console.log(test);