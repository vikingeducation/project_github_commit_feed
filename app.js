const http = require('http');
const fs = require('fs');
const url = require('url');

const github = require('./lib/gitWrapper');
const json = require('./data/commits.json');

const port = 3000;
const host = 'localhost';

let reqQuery;

const server = http.createServer( (req, res) => {
  let path = req.url;

  console.log(path);

  if (path.match(/^\/commits\?.+/)) {
    reqQuery = url.parse(path,true).query;
    console.log(reqQuery);
  }

  if (reqQuery) {
    const gitData = github.gitCommits(reqQuery.user, reqQuery.repo);
    
    gitData.then( (resolvedData) => {
      fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        data = data.replace('{{ commitFeed }}', JSON.stringify(resolvedData, null, 2));
        res.end(data);
      });
    });
  }
});

server.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});

