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
      
      let body = '';
    req.on("data", data => {
      body += data.toString();
    });
    req.on("end", () => {
      body = JSON.parse(body);
      console.log('body ', body)
      let info_obj = {owner: body.pusher.name, repo: body.repository.name};
      console.log('info_obj ', info_obj)
      github_wrapper.getCommits(info_obj, function(userCommits) {
        let scrubbedData = scrubTheData(userCommits);
        console.log('scrubbed data ', scrubbedData)
        res.end(
          // data.replace(regex, JSON.stringify(scrubbedData, null, 2))
        );
      });
    });

    }


    else if (!info_obj) {
      res.end(
        data.toString().replace(regex, commits)
      );
    } else {
      github_wrapper.getCommits(info_obj, function(userCommits) {
        console.log('info_obj from form submit ', info_obj)
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
