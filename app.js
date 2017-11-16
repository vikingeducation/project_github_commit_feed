var github = require("./lib/github");
fs = require("fs");
var http = require("http");
let url = require("url");

var commits = github.githubCommits(
  "GeneTinderholm",
  "project_github_commit_feed"
);

var server = http.createServer((req, res) => {
  path = url.parse(req.url).pathname;
  if (path === "/") {
    displayRoot(req, res);
  } else if (path === "/commits") {
    displayCommits(req, res);
  }
});
server.listen(3000, "localhost");

let displayCommits = (req, res) => {
  fs.readFile("./public/index.html", "utf8", (err, page) => {
    if (err) {
      res.statusCode = 404;
      res.end("404");
    } else {
      let body = "";
      req.on("data", data => {
        console.log("req.on data event fired");
        body += data;
        console.log(data);
      });
      req.on("end", () => {
        req.body = body;
        console.log("body is " + body);
        let path = url.parse(req.url).pathname;
        let query = url.parse(req.url, true).query;
        github
          .githubCommits(query.owner, query.repo)
          .then(data => {
            return data;
          })
          .then(data => {
            res.statusCode = 200;
            let jData = JSON.stringify(data["data"]);
            let body2 = page.replace("{{commitData}}", jData);
            res.end(body2);
          })
          .catch(err => {
            if (err) {
              console.log(err);
            }
          });
      });
    }
  });
};

var displayRoot = (req, res) => {
  fs.readFile("./public/index.html", "utf8", (err, data) => {
    if (err) {
      res.end("404");
    } else {
      res.end(data);
    }
  });
};

var appObj;
module.exports = appObj;
