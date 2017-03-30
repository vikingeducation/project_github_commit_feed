let githubWrapper = require('./lib/githubWrapper');
const http = require('http');
const fs = require('fs');
const host = 'localhost';
const port = '3000';
const jsonData = require('./data/commits.json');
const url = require('url');


let userInfo = githubWrapper.setUserInfo('nicoasp', 'assignment_js_sprint');
githubWrapper.getCommits(userInfo).then(data => {
  // console.log(data);
});

//For testing: ngrok http 3000

let server = http.createServer(function(req, res) {
  let pathname = url.parse(req.url).pathname;
  let params = url.parse(req.url, true).query;

  fs.readFile('./public/index.html', 'utf8', function(err, data) {
    if (err) {
      res.statusCode('404');
      res.end('404 not found');
    }
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    let commitsData = JSON.stringify(jsonData, null, 2);
    data = data.replace('{{ commitFeed }}', commitsData);
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log('Server listening at ' + host + ':' + port);
});
