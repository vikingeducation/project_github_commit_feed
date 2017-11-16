var github = require("./lib/github");
fs = require("fs");
var http = require("http");
let url = require("url");

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
        let path = url.parse(req.url).pathname;
        let query = url.parse(req.url, true).query;
        github
          .githubCommits(query.owner, query.repo)
          .then(data => {
            return data;
          })
          .then(data => {
            res.statusCode = 200;
            let keysArr = ["'commit']['message'", 'author', 'html_url', 'sha'];
            let filterData = data['data']['commit']['message'] + data['data']['author'] + data['data']['html_url'] + data['data']['sha'];
            let jData = JSON.stringify(filterData, null, "\t");
            let body2 = page.replace("{{commitData}}", jData);
            fs.writeFile('./public/commitData.json', jData, (err) => {
              if(err){
                throw err;
              } else{}
            })
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
      let dummyData = require("./public/dummyFile.json");
      let body = data;
      let jData = JSON.stringify(dummyData, null, "\t");
      body = body.replace("{{commitData}}", jData);
      res.end(body);
    }
  });
};

var appObj;
module.exports = appObj;
