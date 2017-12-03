const http = require('http');
const fs = require('fs'); 
const url = require('url');
// const commits = require('./data/commits.json');
const githubRepoCommits = require('./lib/wrapper');
var router = require('./lib/router');

var path = './public/index.html';

var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Headers": "GET, POST, PUT, PATCH, DELETE"
};

var parseGet = (path, callback) => {
   var str = url.parse(path);
   var re = /\=(\w+)/g;
   var matches = str.path.match(re);
   var user;
   var repo;

   if(matches !== null) { 
      user = matches[0].substring(1);
      repo = matches[1].substring(1);
   }
   callback(user, repo);
};

var requestListener = (req, res) => {
  
};

http.createServer(router.handle).listen(3000);