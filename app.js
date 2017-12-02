const http = require('http');
const fs = require('fs'); 
const url = require('url');
const commits = require('./data/commits.json');
const githubAPI = require('./lib/wrapper');

var path = './public/index.html';

var parseGet = (path, callback) => {
   var str = url.parse(path);
   var re = /\=(\w+)/g;
   var matches = str.path.match(re);
   
   if(matches !== null) { 
      var user = matches[0].substring(1);
      var repo = matches[1].substring(1);
   }
   callback(user, repo);
};

var requestListener = (req, res) => {

   // 2. Check for parameters and make github call
   // 3. Return HTML
  
   res.writeHead(200, {
      'Content-type':'text/html' 
   });
   
   parseGet(req.url, (user, repo) => {
      // if both parameters exist
      if((user) && (repo)) {
         // in resolve of promise, call API
         var APIresponse = new Promise((resolve, reject) => {
            resolve(githubAPI.githubRepoCommits(user, repo)); 
         }).then((value) => {
            console.log(value);
         });
         
         // APIresponse.then(() => {
         //    // stringify results from JSON file
         //    var commitsStr = JSON.stringify(commits, null, 2);
         //    // only call fs.readFile if URL parameters are present and JSON parameters are correct
         //    fs.readFile(path, 'utf8', (err, data) => {
         //       if (err) { throw err; }
         //       data = data.replace('{{ commitFeed }}', commitsStr);
         //       res.write(data);
         //       res.end();
         //    });
         // });
         
      } else {
         // handle readFile without user and repo parameters
         fs.readFile(path, 'utf8', (err, data) => {
            if (err) { throw err; }
            data = data.replace('{{ commitFeed }}', 'Select a user and repository.');
         });
      }
   });   
};

http.createServer(requestListener).listen(3000);