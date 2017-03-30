const http = require("http");
const fs = require("fs");
const commits = require("./data/commits");
const url = require("url");
let github_wrapper = require("./github_wrapper");
const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/html");
  fs.readFile("./public/index.html", (err, data) => {
    let regex = /{{commitFeed}}/;

    let info_obj = parseUrl(req.url);

    if (err) {
      throw err;
    } else if (req.url === "/github/webhooks") {
      let body = "";
      req.on("data", data => {
        body += data.toString();
      });
      req.on("end", () => {
        body = JSON.parse(body);
        console.log("body ", body);
        let info_obj = { owner: body.pusher.name, repo: body.repository.name };
        console.log("info_obj ", info_obj);
        github_wrapper.getCommits(info_obj, function(userCommits) {
          fs.writeFile("./data/commits.json", JSON.stringify(userCommits));
          var _headers = {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
          };
          res.writeHead(200, _headers);
          res.end("200 OK");
        });
      });
    } else if (!info_obj) {
      res.end(data.toString().replace(regex, JSON.stringify(commits, null, 2)));
    } else {
      github_wrapper.getCommits(info_obj, function(userCommits) {
        res.end(
          data.toString().replace(regex, JSON.stringify(userCommits, null, 2))
        );
      });
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function parseUrl(urlData) {
  let regex = /user=(.+)&repo=(.+)/;
  let matches = regex.exec(urlData);
  if (matches) {
    return {
      owner: matches[1],
      repo: matches[2]
    };
  } else {
    return false;
  }
}
