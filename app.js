const http = require('http');

// const commits = require('./data/commits.json');
const githubRepoCommits = require('./lib/wrapper');
var router = require('./lib/router');

http.createServer(router.handle).listen(3000);