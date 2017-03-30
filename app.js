const http = require("http");
const fs = require("fs");
const commits = require("./data/commits");
const url = require('url');
var github_wrapper = require("./github_wrapper");
const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  let info_obj = parseUrl(req.url);
  res.setHeader("Content-Type", "text/html");
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      throw err;
    }

    github_wrapper.getCommits(info_obj, function(userCommits) {
      let regex = /{{commitFeed}}/;
      res.end(data.toString().replace(regex, JSON.stringify(userCommits, null, 2)));
    })
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function parseUrl(urlData) {
  let regex = /user=(.+)&repo=(.+)/
 
  var matches = regex.exec(urlData);
  return {
    owner: matches[1],
    repo: matches[2]
  }
}