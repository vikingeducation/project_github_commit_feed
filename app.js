const http = require('http');
const fs = require('fs'); 
const url = require('url');
// const commits = require('./data/commits.json');
const githubRepoCommits = require('./lib/wrapper');

var path = './public/index.html';

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
   // 1. Return HTML
   // 2. Check for parameters and make github call
   // 3. Return HTML
  
   res.writeHead(200, {
      'Content-type':'text/html' 
   });

  //  fs.readFile(path, 'utf8', (err, data) => {
  //   if (err) { throw err; }
  //   data = data.replace('{{ commitFeed }}', 'Select a user and repository.');
  //   res.write(data);
  //   res.end();
  //   });
   
   parseGet(req.url, (user, repo) => {
      // if both parameters exist
      if((user) && (repo)) {
         
         var promise = githubRepoCommits.githubRepoCommits.getCommits(user, repo);
         promise.then((output) => {
            //  stringify results from JSON file
             var commitsStr = JSON.stringify(output, null, 2);

            //  only call fs.readFile if URL parameters are present and JSON parameters are correct
            fs.readFile(path, 'utf8', (err, data) => {
               if (err) { throw err; }
               data = data.replace('{{ commitFeed }}', commitsStr);
               res.write(data);
               res.end();
            });
          });
         
      } else {
         // handle readFile without user and repo parameters
         fs.readFile(path, 'utf8', (err, data) => {
            if (err) { throw err; }
            data = data.replace('{{ commitFeed }}', 'Select a user and repository.');
            res.write(data);
            res.end();
         });
      }
   });   
};

http.createServer(requestListener).listen(3000);