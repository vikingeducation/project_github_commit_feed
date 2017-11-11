var apiKey = process.env.MY_VARIABLE


function gitHubWrapper(userName, repoName) {
  var GitHub = require('github');

  var github = new GitHub({
    debug: true,
  });

  github.authenticate({
      type: "oauth",
      token: apiKey
  });

  getCommits = () => {
    github.repos.getCommits({
        owner: 'visiona',
        repo: 'assignment_githuh'
    })

    // .then(result => {
    //   const firstCommitId = result.data[0].id
    //
    //   return github.repos.getCommits({
    //     owner: 'visiona',
    //     repo: 'assignment_githuh',
    //     // id: firstCommitId
    //     // number: 640
    //   })
    // })

    .then(result => {
      // result.data has review properties
      console.log(result.data)
    })
  }

  return getCommits();
}


gitHubWrapper('visiona', 'assignment_githuh');

module.exports = gitHubWrapper;
