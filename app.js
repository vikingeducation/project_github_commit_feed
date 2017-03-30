var apikey = process.env.githubKey;
var GithubWrapper = require('./lib/GithubWrapper');
var githubWrapper = new GithubWrapper(apikey);
var server = require('./lib/server');



// githubWrapper.authenticate();

// githubWrapper.getCommits(
// {
//   owner: 'tim5046',
//   repo: 'assignment_githuh'
// }
// , function(err, res){
//     res.data.forEach(function(commit){
//       console.log(Object.keys(commit))
//     })
//       console.log('Response: ' + res.data);
// });



