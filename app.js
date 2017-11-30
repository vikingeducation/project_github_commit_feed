const http = require('http');
const fs = require('fs'); 
const commits = require('./data/commits.json');

var path = './public/index.html';

var commitsStr = JSON.stringify(commits, null, 2);

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
   
};

http.createServer(requestListener).listen(3000);

// 