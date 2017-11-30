const http = require('http');
const fs = require('fs'); 

var path = './public/index.html';

var requestListener = (req, res) => {
   res.writeHead(200, {
      'Content-type':'text/html' 
   });
   fs.readFile(path, 'utf8', (err, data) => {
      if (err) { throw err; }
      res.write(data);
      res.end();
    });
   
};

http.createServer(requestListener).listen(3000);

// 