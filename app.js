const http = require('http');
const fs = require('fs');
const url = require('url');
const GithubApiWrapper = require('./lib/github');

const port = process.env.PORT || 3000;
const host = 'localhost';
let commitFeed;

const _saveCommits = (data, done) => {
  const commitString = JSON.stringify(data, null, 2);
  fs.writeFile('./data/commits.json', commitString, 'utf8', (err) => {
    if (err) throw err;
    done();
  });
};

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const { user, repo } = urlObj.query;

  const github = new GithubApiWrapper();
  const p = new Promise((resolve) => {
    if (user) {
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
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        commitFeed = JSON.parse(fs.readFileSync('./data/commits.json', 'utf8'));
        commitFeed = JSON.stringify(commitFeed, null, 2);
        res.end(data.replace('{{ commitFeed }}', commitFeed));
      }
    });
  });
});

server.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
