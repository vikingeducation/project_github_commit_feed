var router = require('./router');

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
