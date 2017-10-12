const http = require('http');
const fs = require('fs');
const url = require('url');
const GithubApiWrapper = require('./lib/github');

const port = process.env.PORT || 3000;
const host = 'localhost';
const _headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
};
let commitFeed = require('./data/commits');

const render = (req, res) => {
  const method = req.method.toLowerCase();

  if (method === 'get') {
    fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        commitFeed = JSON.parse(fs.readFileSync('./data/commits.json', 'utf8'));
        commitFeed = JSON.stringify(commitFeed, null, 2);
        res.write(data.replace('{{ commitFeed }}', commitFeed));
        res.end();
      }
    });
  } else if (method === 'post') {
    commitFeed = JSON.parse(fs.readFileSync('./data/commits.json', 'utf8'));
    commitFeed = JSON.stringify(commitFeed, null, 2);
    res.end('200 OK');
  }
};

const _saveCommits = (req, res, data) => {
  const commitString = JSON.stringify(data, null, 2);
  fs.writeFile('./data/commits.json', commitString, 'utf8', (err) => {
    if (err) throw err;
    render(req, res);
  });
};

const _getCommits = (req, res, user, repo) => {
  const github = new GithubApiWrapper();

  github.getCommits(user, repo, (results) => {
    _saveCommits(req, res, results);
  });
};

const _extractPostData = (req, done) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    let webhookData = unescape(body).slice(8);
    webhookData = JSON.parse(webhookData);
    req.body = webhookData;
    done();
  });
};

const server = http.createServer((req, res) => {
  const method = req.method.toLowerCase();
  const urlObj = url.parse(req.url, true);
  const path = urlObj.pathname;
  const { user, repo } = urlObj.query;

  if (method === 'get') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    if (user) {
      _getCommits(req, res, user, repo);
    } else {
      render(req, res);
    }
  } else if (method === 'post' && path === '/github/webhooks') {
    res.writeHead(200, _headers);

    const p = new Promise((resolve) => {
      _extractPostData(req, resolve);
    });

    p.then(() => {
      _getCommits(req, res, req.body.pusher.name, req.body.repository.name);
    })
      .catch((err) => {
        console.error(err);
      });
  }
});

//   const p = new Promise((resolve) => {
//     if (method === 'post' && path === '/github/webhooks') {
//       _extractPostData(req, resolve);
//       github.getCommits(req.user, req.repo, (results) => {
//         _saveCommits(results, resolve);
//       });
//     } else if (user) {
//       github.getCommits(user, repo, (results) => {
//         // console.dir(results, { depth: null, colors: true });
//         _saveCommits(results, resolve);
//       });
//     } else {
//       resolve();
//     }
//   });
//   p.then(() => {
//     fs.readFile('./public/index.html', 'utf8', (err, data) => {
//       if (err) {
//         res.writeHead(404);
//         res.end('404 Not Found');
//       } else {
//         res.writeHead(200, _headers);
//         commitFeed = JSON.parse(fs.readFileSync('./data/commits.json', 'utf8'));
//         commitFeed = JSON.stringify(commitFeed, null, 2);
//         res.write(data.replace('{{ commitFeed }}', commitFeed));
//         res.end('200 OK');
//       }
//     });
//   });
// });

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
