var router = require('./router');
const fs = require('fs'); 
const url = require('url');
var githubRepoCommits = require('./wrapper');

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

var GETListener = (req, res) => {

// 2. Check for parameters and make github call
// 3. Return HTML

res.writeHead(200, _headers);

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

module.exports = GETListener;
