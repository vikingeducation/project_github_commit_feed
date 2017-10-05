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

  if (request.pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{ commitFeed }}', JSON.stringify(savedFeed, null, 2));
        res.write(data);
    });

  } else if (request.pathname === '/commits') {
    let user = request.query.user;
    let repo = request.query.repo;

    // error check user and repo
    if (checkValid(user) && checkValid(repo)) {
      wrapper.getCommits(user.trim(), repo.trim(), res);
    }

  } else if (request.pathname === '/github/webhooks' && req.method === 'POST') {

    res.writeHead(200, _headers);

    let p = new Promise((resolve) => {
        _extractPostData(req, resolve);
    });


    p.then(() => {

      // .slice(8) was removed because `payload=` was NOT in the req.body
      let result = JSON.parse(decodeURIComponent(req.body)); 

      let user = result.pusher.name;
      let repo = result.repository.name;

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


// Get data from the requested object and attach it to the body object
// Code from the assignment_building_the_express_router
let _extractPostData = (req, done) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
};


function checkValid(str) {
  if ((str !== undefined) && (str.trim().length > 0)) {
    return true;

  } else {
    console.log(`${str} not valid input, try again`);
    return false;
  }
}
