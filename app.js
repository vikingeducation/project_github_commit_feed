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
  let pathname = url.parse(req.url).pathname;
  let params = url.parse(req.url, true).query;

  let userInfo = githubWrapper.setUserInfo(params.user, params.repo);

  fs.readFile('./public/index.html', 'utf8', function(err, fileData) {
    if (err) {
      res.statusCode('404');
      res.end('404 not found');
    }
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    if (pathname == '/commits') {
      githubWrapper.getCommits(userInfo).then(commitData => {
        let commitsData = JSON.stringify(commitData, null, 2);
        fileData = fileData.replace('{{ commitFeed }}', commitsData);

        res.end(fileData);
      });
    } else {
      // } else if (pathname == '/github/webhooks') {
      //   console.log(req);
      // }
      res.end(fileData);
    }
  });
});

server.listen(port, host, () => {
  console.log('Server listening at ' + host + ':' + port);
});
