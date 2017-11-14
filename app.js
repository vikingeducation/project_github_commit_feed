var GithubApi = require('github');

// user token
github.authenticate({
    type: 'token',
    token: 'userToken',
});
//34c3280474969b5c28398b1af11369ff8b27f763 token

wrapper.getCommits = (github, username, repo) => {
    github.repos.getCommits({
     owner: username,
     repo: repo
    }, function(err, res) {
     if (err) console.log(err);
     else console.log(JSON.stringify(res, null , "  "));
    });
};