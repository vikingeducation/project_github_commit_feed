var GitHub = require('github');

var github = new GitHub({
    // optional
  debug: true,

})

var apiKey = process.env.MY_VARIABLE

github.authenticate({
    type: "oauth",
    token: apiKey
});


// github.users.getFollowingForUser({
//     // optional
//     // headers: {
//     //     "cookie": "blahblah"
//     // },
//   username: 'visiona'
//   }, function (err, res) {
//     if (err) throw err
//     console.log(JSON.stringify(res))
// })


github.repos.getCommits({
    owner: 'visiona',
    repo: 'assignment_githuh'
})

.then(result => {
  const firstCommitId = result.data[0].id

  return github.repos.getCommits({
    owner: 'visiona',
    repo: 'assignment_githuh',
    // id: firstCommitId
    // number: 640
  })
})

.then(result => {
  // result.data has review properties
  console.log(result.data)
})

// GitHub API Key
// MY_VARIABLE=59daac4b74fd9302ce37f776e9f0b3d5b2fe9cab node app.js
