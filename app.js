const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./lib/gitWrapper');

const indexHtml = './public/index.html';
let reqQuery;
const formPath = /^\/commits\?.+/;
const jsonPath = './data/commits.json';
var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

const port = 3000;
const host = 'localhost';


const server = http.createServer( (req, res) => {

  if (req.method === "POST") {
    console.log(req.body)
  }


  const path = req.url;

  if (path.match(formPath)) {
    reqQuery = url.parse(path, true).query;
  }

  if (reqQuery) {

    let data;
    
    github.gitCommits(reqQuery.user, reqQuery.repo)
    .then( (resolvedData) => {
      let scrubbedData = scrubCommits(resolvedData);
      return writeFile('./data/commits.json', scrubbedData);
    })
    .then( () => {
      return readFile(indexHtml);
    })
    .then( (dat) => {
      data = dat;
      return readFile(jsonPath);
    })
    .then( (json) => {
      data = data.replace('{{ commitFeed }}', json);
      sendOkResponse(res, data);
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

server.listen(3000, 'http://localhost:3000/github/webhooks', () => {

})


function sendOkResponse(res, data) {
  res.writeHead(200, _headers);
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
      resolve(data);
    });
  });
}
