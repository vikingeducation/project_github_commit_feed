let githubWrapper = require('./lib/githubWrapper');
const http = require('http');
const fs = require('fs');
const host = 'localhost';
const port = 3000;
const jsonData = require('./data/commits.json');
const url = require('url');
const _headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
};
const {
  readFilePromise,
  writeFilePromise
} = require('./lib/file_helpers');


let server = http.createServer(function(req, res) {

  let pathname = url.parse(req.url).pathname;
  let params = url.parse(req.url, true).query;

  let userInfo = githubWrapper.setUserInfo(params.user, params.repo);

  fs.readFile('./public/index.html', 'utf8', function(err, fileData) {
    if (err) {
      res.statusCode('404');
      res.end('404 not found');
    }
    res.writeHead(200, _headers);

    if (pathname == '/commits') {
      githubWrapper.getCommits(userInfo).then(() => {
        fs.readFile('./data/commits.json', 'utf8', function(err, data){
          data = JSON.parse(data);
          data = JSON.stringify(data, null, 2);
          fileData = fileData.replace('{{ commitFeed }}', data);
          res.end(fileData);          
        })

      });
    } else if (pathname == '/github/webhooks') {
      let p = new Promise((resolve, reject) => {
        _writePostToFile(req, resolve);
        return resolve();
      });

      p.then(function() {
        res.end();
      });
    } else {
      fs.readFile('./data/commits.json', 'utf8', function(err, data){
        data = JSON.parse(data);
        data = JSON.stringify(data, null, 2);
        fileData = fileData.replace('{{ commitFeed }}', data);
        res.end(fileData);          
      });
    }
  });
});

function _writePostToFile(req, done) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = decodeURIComponent(body);
    body = body.substring(8);
    body = JSON.parse(body);
    usefulData = [{
      username: body.pusher.name,
      repo: body.repository.name
    }];
    return readFilePromise('./data/commits.json', usefulData)
    .then(function(fileDataAndStringifiedData) {
      return writeFilePromise('./data/commits.json',fileDataAndStringifiedData);
    })
    .then(function(){
      done();
    });    
  });
}

server.listen(port, host, () => {
  console.log('Server listening at ' + host + ':' + port);
});

