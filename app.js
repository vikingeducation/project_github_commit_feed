const http = require('http');
const url = require('url');
const fs = require('fs');

const wrapper = require('./gitHubApiWrapper');

const hostname = 'localhost';
const port = 3000;

let github = wrapper.init();
wrapper.authenticate(github);

let savedFeed = require('./data/commits.json');

const server = http.createServer((req, res) => {
  let request = url.parse(req.url, true);

  // show existing saved commits feed
  if (request.pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{ commitFeed }}', JSON.stringify(savedFeed, null, 2));
        res.write(data);
    });

  } else if (request.pathname === '/commits') {
    // get user entries for hitting the gihub api and getting new feed
    let user = request.query.user;
    let repo = request.query.repo;

    // error check user and repo
    if (checkValid(user) && checkValid(repo)) {
      wrapper.getCommits(user.trim(), repo.trim(), res);
    }
  } else {
    res.statusCode = 200;

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{ commitFeed }}', JSON.stringify(savedFeed, null, 2));
        res.write(data);
    });
  }

  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function checkValid(str) {
  if ((str !== undefined) && (str.trim().length > 0)) {
    return true;

  } else {
    console.log(`${str} not valid input, try again`);
    return false;
  }
}
