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
  else if(path === '/github/webhooks'){
    displayWebhooks(req, res);
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
            let keysArr = ["'commit']['message'", "author", "html_url", "sha"];
            let dataArray = data["data"];
            let checkArray = fs.readFileSync("./public/shas", "utf8");
            checkArray = checkArray.split(",");
            let filterData = dataArray.map(element => {
              let obj = {
                message: element.commit.message,
                author: element.author,
                html_url: element.html_url,
                sha: element.sha
              };
              if (!checkArray.includes(element.sha)) {
                checkArray.push(element.sha);
                fs.appendFile("./public/commits.json", JSON.stringify(obj, null, '\t'), err => {
                  if (err) {
                    throw err;
                  }
                });
              }
              return obj;
            });

            let jData = JSON.stringify(filterData, null, "\t");
            let body2 = page.replace("{{commitData}}", jData);
            checkArray = checkArray.join(",");
            fs.writeFile("./public/shas", checkArray, err => {
              if (err) {
                throw err;
              } else {
              }
            });
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

let displayWebhooks = (req, res) => {
  var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};
  let body = '';
  req.on('data', data => {
    body += data;
  });
  req.on('end', () => {
    res.writeHead(200, _headers);
  console.log(body);
  body = body.substring(8);
  jBody = JSON.parse(body);
  console.log(jBody);
    res.end('200 OK');
  });
}

var appObj;
module.exports = appObj;
