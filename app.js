const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./lib/gitWrapper');

const json = require('./data/commits.json');
const indexHtml = './public/index.html';

const port = 3000;
const host = 'localhost';



let reqQuery;
const formPath = /^\/commits\?.+/;

const server = http.createServer( (req, res) => {
  const path = req.url;

  if (path.match(formPath)) {
    reqQuery = url.parse(path, true).query;
  }

  if (reqQuery) {

    github.authenticate();

    github.gitCommits(reqQuery.user, reqQuery.repo)

    .then( (commitData) => {
      let scrubbedData = scrubCommits(commitData);
      return writeFile('./data/commits.json', scrubbedData);
    })

    .then( readFile(indexHtml) )

    .then( (data) => {
      data = data.replace('{{ commitFeed }}', JSON.stringify(json, null, 2));
      sendOkResponse(res, data);

    }).catch( (err) => {
      console.log(err);
    });

  } else {

    readFile(indexHtml).then( (data) => {
      const msg = 'Enter a user and repo to display its commits.';
      data = data.replace('{{ commitFeed }}', msg);
      sendOkResponse(res, data);
    });

  }
});


server.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});


function sendOkResponse(res, data) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(data);
}


function scrubCommits(resolvedData) {
  let obj = { data: [] };

  resolvedData.data.map((eachCommit) => {
    obj.data.push({
      author: eachCommit.commit.author.name,
      commit: eachCommit.commit.message,
      url: eachCommit.url,
      sha: eachCommit.sha
    });
  });

  return obj;
}


function writeFile(path, data) {
  const writeData = JSON.stringify(data, null, 2);

  return new Promise( (resolve) => {
    fs.writeFile(path, writeData, 'utf-8', (err) => {
      if (err) throw err;
      resolve();
    });
  });
}


function readFile(path) {
  return new Promise( (resolve) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) throw err;
      return resolve(data);
    });
  });
}
