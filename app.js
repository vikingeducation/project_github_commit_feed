const http = require('http');
const fs = require('fs');
const url = require('url');
let json = require('./data/commits');

const hostname = 'localhost';
const port = 3001;

const getParams = (query) => {
  let usernameRegEx = /username=([^&]*)/;
  let repoRegEx = /repo=([^&]*)/;

  let username = query.match(usernameRegEx);
  let repo = query.match(repoRegEx);

  let results = {
    username: username[1],
    repo: repo[1]
  };

  return results;
};

const handleRouting = (req, res) => {
  res.statusCode = 200;
  let method = req.method.toLowerCase();
  const query = url.parse(req.url).query;

  if (query) {
    let params = getParams(query);
  }
  
  fs.readFile('./public/index.html', 'utf8', (err, file) =>{
    if (err) throw err;

    let feed = JSON.stringify(json, null, 2);
    file = file.replace('{{ commitFeed }}', feed);

    res.setHeader('Content-Type', 'text/html');
    res.write(file);
    res.end();
  });
};
const server = http.createServer(handleRouting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});