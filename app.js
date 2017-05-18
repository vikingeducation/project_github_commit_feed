const http = require('http');
const fs = require('fs');
const url = require('url');
const githubWrapper = require('./lib/github');
const GITHUB_LEADING_TRIM_AMT = 8;

let savedCommits = require('./data/commits');
let savedFeed = JSON.stringify(savedCommits, null, 2);
const hostname = 'localhost';
const port = 3002;
const _webhookHeaders = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

const refreshFeed = () => {
  savedFeed = JSON.stringify(savedCommits, null, 2);
};

const handleRouting = (req, res) => {
  let method = req.method.toLowerCase();
  const path = url.parse(req.url).pathname;
  const query = url.parse(req.url, true).query;
  res.statusCode = 200;

  let isQueryEmpty = Object.keys(query).length === 0;

  // If there's a query, process it first, save it to commits.json file, then render commits.json
  // else if there's no query, just open up commits.json
  if (method === "get") {
    if (!isQueryEmpty) {
      // let params = getParams(query);
      githubWrapper.init();
      githubWrapper.authenticate(process.env.GITHUB_API_KEY);
      githubWrapper.getRepoCommits(query.username, query.repo, (err, feed) => {
        if (feed) {
          // feed = JSON.stringify(feed, null, 2);
          scrubFeed(feed.data);
          refreshFeed();
          render(req, res, savedFeed);
        } else {
          render(req, res, savedFeed);
        }
      });
    } else {
      render(req, res, savedFeed);
    }
  } else if (method === "post" && path === "/github/webhooks") {
    // TO DO
    res.writeHead(200, _webhookHeaders);

    var p = new Promise((resolve) => {
        _extractPostData(req, resolve);
    });
    
    p.then(() => {
      console.log(JSON.parse(req.body.slice(GITHUB_LEADING_TRIM_AMT)));
      res.end();
    })
    .catch((error) => {
      console.error(error);
    });
  }
};

const scrubFeed = (feed) => {

  // this returns an array with our scrubbed results
  let results = feed.map((commit) => {
    let scrubbedCommit = {};
    scrubbedCommit.message = commit.commit.message;
    scrubbedCommit.author = commit.commit.author;
    scrubbedCommit.url = commit.html_url;
    scrubbedCommit.sha = commit.sha;
    return scrubbedCommit;
  });
  
  _saveFeed(results);
};

const _saveFeed = (results) => {
// Iterates through every commit found
  results.forEach((commit) => {
    // Check if author exists
    let author = commit.author.name;
    if (savedCommits[author]) {
      // If so, check if sha does not exist yet
      let isNewEntry = true;
      savedCommits[author].forEach((element) => {
        if (element.sha === commit.sha) {
          isNewEntry = false;
        }
      });
      // if it's a new entry, save it to top. Otherwise, do nothing
      if (isNewEntry) {
        savedCommits[author].unshift(commit);
      }
    } else {
      // If new author found, initialize an array with this commit
      savedCommits[author] = [commit];
    }
  });

  // rewrites commits.json with new information
  fs.writeFileSync('./data/commits.json', JSON.stringify(savedCommits, null, 2));
};

const render = (req, res, feed) => {
  fs.readFile('./public/index.html', 'utf8', (err, file) =>{
    if (err) throw err;

    file = file.replace('{{ commitFeed }}', feed);
    res.setHeader('Content-Type', 'text/html');
    res.write(file);
    res.end();
  });
};

const _extractPostData = (req, done) => {
  var body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = unescape(body);
    done();
  });
};

const server = http.createServer(handleRouting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});