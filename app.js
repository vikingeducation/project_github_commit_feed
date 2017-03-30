const http = require("http");
const fs = require("fs");
const commits = require("./data/commits");
const url = require("url");
let github_wrapper = require("./github_wrapper");
const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  if (req.url === "/github/webhooks") {
    let body = '';
    req.on("data", data => {
      body += data.toString();
      console.log(body);
    });
    req.on("end", () => {
      console.log("END");
    });
  }

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
          data.toString().replace(regex, JSON.stringify(scrubbedData, null, 2))
        );
      });
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function scrubTheData(data) {
  let scrubArray = [];
  let commitsArray = data.data;
  commitsArray.forEach(commit => {
    let scrubObj = {};
    scrubObj.sha = commit.sha;
    scrubObj.commit_message = commit.commit.message;
    scrubObj.author = commit.commit.author;
    scrubObj.html_url = commit.html_url;
    scrubArray.push(scrubObj);
  });
  return scrubArray;
}

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
