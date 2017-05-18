const http = require('http');
const fs = require('fs');
let json = require('./data/commits');

const hostname = 'localhost';
const port = 3001;

const _extractPostData = (req, done) => {
  var body = '';
  console.log(body);
  console.log('hi');
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
};

const handleRouting = (req, res) => {
  res.statusCode = 200;
  let method = req.method.toLowerCase();

  var p = new Promise((resolve) => {
      if (method === 'post') {
        _extractPostData(req, resolve);
      } else {
        resolve();
      }
  });

  p.then(()=>{
    fs.readFile('./public/index.html', 'utf8', (err, file) =>{
      if (err) throw err;

      let feed = JSON.stringify(json, null, 2);
      file = file.replace('{{ commitFeed }}', feed);

      res.setHeader('Content-Type', 'text/html');
      res.write(file);
      res.end();
    });
  });
};
const server = http.createServer(handleRouting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});