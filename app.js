const http = require('http');
const url = require('url');
const fs = require('fs');

const wrapper = require('./gitHubApiWrapper');

const hostname = 'localhost';
const port = 3000;

let github = wrapper.init();
wrapper.authenticate(github);

let savedFeed = require('./data/commits.json');

let _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

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
  } else if (request.pathname === '/github/webhooks' && req.method === 'POST') {

    res.writeHead(200, _headers);

    let p = new Promise((resolve) => {
        extractPostData(req, resolve);
    });

    p.then((data) => {
      console.log(data);

      let user = data.pusher.name;
      let repo = data.repository.name;

      // error check user and repo
      if (checkValid(user) && checkValid(repo)) {
        wrapper.getCommits(user.trim(), repo.trim(), res);
      }
      
      res.end('200 OK');
    })
    .catch((err) => {
        console.log(err);
    });

  } else {
    res.statusCode = 200;

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{ commitFeed }}', JSON.stringify(savedFeed, null, 2));
        res.write(data);
    });

    res.end();
  }

  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//Get data from the requested objected and attach it to the requested object body
function extractPostData(req, done) {
    let body = '';

    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        let result = JSON.parse(decodeURIComponent(body).slice(8)); //remove payload= which is a length of 8
        console.log(result);
        done(result);
    });
}


function checkValid(str) {
  if ((str !== undefined) && (str.trim().length > 0)) {
    return true;

  } else {
    console.log(`${str} not valid input, try again`);
    return false;
  }
}
