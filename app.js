const http = require('http');
const fs = require('fs');
const url = require('url');
const githubWrapper = require('./lib/github');

let savedCommits = require('./data/commits');

const hostname = 'localhost';
const port = 3001;

const getParams = (query) => {
  let usernameRegEx = /username=([^&]*)/;
  let repoRegEx = /repo=([^&]*)/;

  let username = query.match(usernameRegEx);
  let repo = query.match(repoRegEx);

  let results = {
    username: username[1],
    repo: repo[1]
  };

  return results;
};

const handleRouting = (req, res) => {
  let method = req.method.toLowerCase();
  const query = url.parse(req.url).query;
  res.statusCode = 200;

  // So if there's a query, process it first, save it to commits.json file, then render commits.json
  // else if there's no query, just open up commits.json
  if (query) {
    let params = getParams(query);
    githubWrapper.init();
    githubWrapper.authenticate(process.env.GITHUB_API_KEY);
    githubWrapper.getRepoCommits(params.username, params.repo, (err, feed) => {
      if (feed) {
        // feed = JSON.stringify(feed, null, 2);
        scrubAndSave(feed.data);
        render(req, res, JSON.stringify(savedCommits, null, 2));
      } else {
        render(req, res, JSON.stringify(savedCommits, null, 2));
      }
    });
  } else {
    render(req, res, JSON.stringify(savedCommits, null, 2));
  }
};

const scrubAndSave = (feed) => {
  let results = feed.map((commit) => {
    let scrubbedCommit = {};
    scrubbedCommit.message = commit.commit.message;
    scrubbedCommit.author = commit.commit.author;
    scrubbedCommit.url = commit.html_url;
    scrubbedCommit.sha = commit.sha;
    return scrubbedCommit;
  });

  if (savedCommits.commits) {
    results.forEach((element) => {
      savedCommits.commits.push(element);
    });
  } else {
    savedCommits.commits = results;
  }
  // results = JSON.stringify(results, null, 2);
  // results = results.substring(1, results.length-1);
  // console.log(results);
  fs.writeFileSync('./data/commits.json', JSON.stringify(savedCommits, null, 2), (err) => {
    if (err) throw err;
    console.log("saved commits appended successfully");
  });
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
const server = http.createServer(handleRouting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});