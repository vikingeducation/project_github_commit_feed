//
let http = require("http");
let port = process.env.PORT || 3000;
let host = "localhost";
const user_name = "karathrash";
const repo = "project_github_commit_feed";

const git = require("./lib/github_wrapper");
var server = http.createServer((req, res) => {
  res.end("this can just be a string");

  console.log("server on");
});
server.listen(port, host, () => {
  console.log(`Listening at: http://${host}:${port}`);
});

//git.authenticate();

git.repos(user_name, repo).then(
  message => {
    console.log(message);
  },
  err => {
    console.log(err);
  }
);
