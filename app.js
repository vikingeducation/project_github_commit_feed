const http = require('http');
const url = require('url');
const fs = require('fs');

const wrapper = require('./gitHubApiWrapper');
const htmlFilePath = './public/index.html';

const hostname = '127.0.0.1';
const port = 3000;

let github = wrapper.init();
wrapper.authenticate(github);

let feed = require('./data/commits.json');
let data = fs.readFileSync(htmlFilePath);

const server = http.createServer((req, res) => {
  let request = url.parse(req.url, true);

  // error check user and repo
  let user = request.query.user;
  let repo = request.query.repo;

  if (checkValid(user) && checkValid(repo)) 
    wrapper.getCommits(github, user.trim(), repo.trim());

  console.log('hit me');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  data = data.toString().replace('{{ commitFeed }}', JSON.stringify(feed, null, 2));
  res.end(data);
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