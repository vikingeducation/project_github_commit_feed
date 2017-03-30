const Github = require('github');
const github = new Github();
const ghToken = process.env.GITHUB_API_KEY;


const gitWrapper = {

  authenticate: () => {
    github.authenticate({
      type: "token",
      token: ghToken
    });
  },

  gitCommits: (owner, repo) => {

    // returns this promise

    return github.repos.getCommits({
      owner: owner,
      repo: repo
    });
  }

};

let commits = gitWrapper.gitCommits('markmarkyesyes', 'project_github_commit_feed').then( data => console.log(data));


module.exports = gitWrapper;
