const http = require('http');
const fs = require('fs');
const url = require('url');
const Handlebars = require('handlebars');
const GithubApiWrapper = require('./lib/github');
let commitFeed = require('./data/commits');

commitFeed = JSON.stringify(commitFeed, null, 2);
const port = process.env.PORT || 3000;
const host = 'localhost';
const _headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
};
let user;
let repo;

const _render = (req, res, feed, commitArr) => {
  const method = req.method.toLowerCase();

  if (method === 'get') {
    const context = {
      user,
      repo,
      commits: commitArr
    };
    fs.readFile('./public/index.hbs', 'utf8', (err, data) => {
      if (err) throw err;
      const template = Handlebars.compile(data.toString());
      const html = template(context);
      res.end(html);
    });
  } else if (method === 'post') {
    res.end('200 OK');
  }
};

const _saveCommits = (req, res, data, commitArr) => {
  commitFeed = JSON.stringify(data, null, 2);
  fs.writeFile('./data/commits.json', commitFeed, 'utf8', (err) => {
    if (err) throw err;
    _render(req, res, commitFeed, commitArr);
  });
};

const _getCommits = (req, res, username, repository) => {
  const github = new GithubApiWrapper();

  github.getCommits(username, repository, (results, commitArr) => {
    _saveCommits(req, res, results, commitArr);
  });
};

const _extractPostData = (req, done) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    const webhookData = JSON.parse(unescape(body).slice(8));
    req.body = webhookData;
    done();
  });
};

const server = http.createServer((req, res) => {
  const method = req.method.toLowerCase();
  const urlObj = url.parse(req.url, true);
  const path = urlObj.pathname;
  ({ user, repo } = urlObj.query);

  if (method === 'get') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    if (user) {
      _getCommits(req, res, user, repo);
    } else {
      _render(req, res, commitFeed);
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

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
