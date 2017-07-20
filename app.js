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
      _writeTemplate(
        ['{{commits}}'],
        'Error! Template file not found!',
        res,
        500
      );
    }

    let query = url.parse(req.url, true).query;
    if (Object.keys(query).length) {
      _respondWithApi(htmlTemplate, query, res, 200);
    } else {
      _writeTemplate(htmlTemplate, '', res, 200);
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
      _writeTemplate(htmlTemplate, commits, res, 200);
    })
    .catch(err => {
      console.error(err);
      _writeTemplate(htmlTemplate, 'API Request Failed', res, 500);
    });
}

function _writeTemplate(template, insertValue, res, code) {
  console.log(template);
  let pageContents = template.toString().replace('{{commits}}', insertValue);

  console.log(code);
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/html');
  res.end(pageContents);
}
