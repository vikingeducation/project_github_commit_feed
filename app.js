let githubWrapper = require('./lib/githubWrapper');
const http = require('http');
const fs = require('fs');
const host = 'localhost';
const port = 3000;
const jsonData = require('./data/commits.json');
const url = require('url');

// let userInfo = githubWrapper.setUserInfo('nicoasp', 'assignment_js_sprint');

//For testing: ngrok http 3000

let server = http.createServer(function(req, res) {
  let _headers = {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
  };

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
      githubWrapper.getCommits(userInfo).then(commitData => {
        let commitsData = JSON.stringify(commitData, null, 2);
        fileData = fileData.replace('{{ commitFeed }}', commitsData);

        res.end(fileData);
      });
    } else if (pathname == '/github/webhooks') {
      let p = new Promise((resolve, reject) => {
        _unpackPost(req, resolve);
        return resolve();
      });

      p.then(function() {
        res.end();
      });
    } else {
      res.end(fileData);
    }
  });
});

function _unpackPost(req, done) {
  var body = '';
  req.on('data', function(data) {
    body += data.toString();
  });
  req.on('end', function() {
    body = decodeURIComponent(body);
    body = body.substring(8);
    body = JSON.parse(body);
    body = JSON.stringify(body, null, 2);
    
    //Need to decode url info
    console.log(body);

    req.body = body;
    done();
  });
}

server.listen(port, host, () => {
  console.log('Server listening at ' + host + ':' + port);
});
