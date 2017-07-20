const http = require('http');
// const commits = require('./data/commits');
const fs = require('fs');
const url = require('url');
const github = require('./lib/github');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, htmlTemplate) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found!');
      console.error(err);
    }

    let query = url.parse(req.url, true).query;
    if (Object.keys(query).length) {
      _respondWithApi(htmlTemplate, query, res);
    } else {
      _writeTemplate(htmlTemplate, '', res);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function _respondWithApi(htmlTemplate, query, res) {
  let commitPromise = github(query.repo, query.username);

  commitPromise
    .then(commits => {
      commits = JSON.stringify(commits, null, 2);
      _writeTemplate(htmlTemplate, commits, res);
    })
    .catch(err => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('API Request Failed');
      console.error(err);
    });
}

function _writeTemplate(template, insertValue, res) {
  let pageContents = template.toString().replace('{{commits}}', insertValue);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(pageContents);
}
