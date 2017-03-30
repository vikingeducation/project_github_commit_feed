const http = require("http");
const fs = require("fs");
const commits = require("./data/commits");
const url = require("url");
var github_wrapper = require("./github_wrapper");
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
    } else if (!info_obj) {
      res.end(
        data.toString().replace(regex, "This is where the commits will live.")
      );
    } else {
      github_wrapper.getCommits(info_obj, function(userCommits) {
        let scrubbedData = scrubTheData(userCommits);
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
  var matches = regex.exec(urlData);
  if (matches) {
    return {
      owner: matches[1],
      repo: matches[2]
    };
  } else {
    return false;
  }
}
