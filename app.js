const fs = require("fs");
const commits = require("./data/commits.json");
const url = require("url");
const express = require("./router/express.js");
const hostname = "0.0.0.0";
const port = 3000;
const app = express();

var html = fs.readFileSync("./public/index.html", "utf8");

html = html.replace("{{commitFeed}}", JSON.stringify(commits, null, 2));

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

app.post("/commits", (req, res) => {
  var body = "";
  req.on("data", data => {
    body += data;
  });
  req.on("end", () => {
    let bodyArray = body.split("&");
    let username = bodyArray[0].split("=")[1];
    let repo = bodyArray[1].split("=")[1];
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
