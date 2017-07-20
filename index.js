const fs = require("fs");
let http = require("http");
let port = process.env.PORT || 3000;

let host = "localhost";
const user_name = "karathrash";
const repo = "project_github_commit_feed";

const git = require("./lib/github_wrapper");

var server = http.createServer((req, res) => {
  res.writeHeader(200, { "Content-type": "text/html" });
  var data = fs.readFileSync("./public/index.html");
  res.end(data);
  console.log(req.url);
  console.log("server on");
});

server.listen(port, host, () => {
  console.log(`Listening at: http://${host}:${port}`);
});

//git.authenticate();
var TestScript = function(buttt) {
  buttt.innerhtml = "sadasdasd";
  console.log("this is the test script");
};
git.repos(user_name, repo).then(
  message => {
    //console.log(message);
  },
  err => {
    //console.log(err);
  }
);
module.exports = { TestScript: "TestScript" };
