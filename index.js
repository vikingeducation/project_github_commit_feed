var apikey = process.env.githubKey;

var GithubWrapper = require('./lib/GithubWrapper');
var githubWrapper = new GithubWrapper(apikey);

githubWrapper.authenticate();

githubWrapper.getCommits({
  owner: 'tim5046',
  repo: 'assignment_githuh'
}, function(err, res){
    res.data.forEach(function(commit){
      console.log(Object.keys(commit))
    })
      console.log('Response: ' + res.data);
});


// var Github = require('github');
// var github = new Github;


// github.authenticate({
//   type: "token",
//   token: apikey
//   })




