const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const GithubApiWrapper = require('./lib/github');

const port = process.env.PORT || 3000;
const host = 'localhost';
const _headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
};
let commitFeed;

const _extractPostData = (req, done) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    body = body.slice(8, body.length);
    let webhookData = querystring.parse(body, null, null);
    console.log(webhookData);
    // console.log(JSON.parse(webhookData));
    done();
  });
};

const _saveCommits = (data, done) => {
  const commitString = JSON.stringify(data, null, 2);
  fs.writeFile('./data/commits.json', commitString, 'utf8', (err) => {
    if (err) throw err;
    done();
  });
};

const server = http.createServer((req, res) => {
  const method = req.method.toLowerCase();
  const urlObj = url.parse(req.url, true);
  const path = urlObj.pathname;
  const { user, repo } = urlObj.query;

  const github = new GithubApiWrapper();
  const p = new Promise((resolve) => {
    if (method === 'post' && path === '/github/webhooks') {
      _extractPostData(req, resolve);
    } else if (user) {
      github.getCommits(user, repo, (results) => {
        // console.dir(results, { depth: null, colors: true });
        _saveCommits(results, resolve);
      });
    } else {
      resolve();
    }
  });
  p.then(() => {
    fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(200, _headers);
        commitFeed = JSON.parse(fs.readFileSync('./data/commits.json', 'utf8'));
        commitFeed = JSON.stringify(commitFeed, null, 2);
        res.write(data.replace('{{ commitFeed }}', commitFeed));
        res.end('200 OK');
      }
    });
  });
});

// server.listen('/github/webhooks', () => {
//   console.log('Listening');
// });

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
