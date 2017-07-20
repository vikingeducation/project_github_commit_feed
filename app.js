const fs = require("fs");
const commits = require("./data/commits.json");
const url = require("url");
const express = require("./router/express.js");
const hostname = "0.0.0.0";
const port = 3000;
const app = express();
const parser = require("./parser.js");

var html = fs.readFileSync("./public/index.html", "utf8");

html = html.replace("{{commitFeed}}", JSON.stringify(commits, null, 2));

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

app.post("/github/webhooks", (req, res) => {
  console.log("IT WORKED");
});

app.post("/commits", (req, res) => {
  parser(req, res);
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
