const http = require('http');
const url = require('url');
const fs = require('fs');

const wrapper = require('./gitHubApiWrapper');
const feed = require('./data/commits.json');
const htmlFilePath = './public/index.html';

const hostname = '127.0.0.1';
const port = 3000;

// let github = wrapper.init();

// wrapper.authenticate(github);
// wrapper.getCommits(github, "maddiereddy", "project_what_have_you_done");

const server = http.createServer((req, res) => {
  let request = url.parse(req.url, true);
  if (request.pathname !== '/stylesheets/style.css') {
    console.log(`Username: ${request.query.user} \nRepo: ${request.query.repo} `);
  }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    let data = fs.readFileSync(htmlFilePath);
    data = data.toString().replace('{{ commitFeed }}', JSON.stringify(feed, null, '  '));
    res.end(data);
});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});






// const GitHubApi = require("github");
// const GITHUB_API_KEY = require('./config.json').token;

// let github = new GitHubApi();

// github.authenticate({
//     type: "token",
//     token: GITHUB_API_KEY
// });

// github.repos.getCommits({
//   owner: "maddiereddy", 
//   repo: "project_what_have_you_done"
// }, function(err, res) {
//   if (err) console.log(err);
//   else console.log(JSON.stringify(res, null , "  "));
// });