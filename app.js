const http = require('http');
const fs = require('fs'); 
const url = require('url');
const commits = require('./data/commits.json');
const githubAPI = require('./lib/wrapper');

var path = './public/index.html';

var commitsStr = JSON.stringify(commits, null, 2);

var parseGet = (path) => {
   var str = url.parse(path);
   var re = /\=(\w+)/g;
   var matches = str.path.match(re);
   
   if(matches !== null) { 
      var user = matches[0].substring(1);
      var repo = matches[1].substring(1);
      githubAPI.githubRepoCommits(user, repo);
   }
};

var requestListener = (req, res) => {
   res.writeHead(200, {
      'Content-type':'text/html' 
   });
   fs.readFile(path, 'utf8', (err, data) => {
      if (err) { throw err; }
      data = data.replace('{{ commitFeed }}', commitsStr);
      res.write(data);
      res.end();
    });

   parseGet(req.url);   
};

http.createServer(requestListener).listen(3000);

// 