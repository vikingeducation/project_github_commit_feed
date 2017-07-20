const http = require("http");
const fs = require("fs");
const commits = require("./data/commits.json");
const url = require("url");
const hostname = "0.0.0.0";
const port = 3000;

var html = fs.readFileSync("./public/index.html", "utf8");

html = html.replace("{{commitFeed}}", JSON.stringify(commits, null, 2));

const server = http.createServer(function(req, res) {
  var body = "";
  console.log(req.url);
  console.log(req.method);
  if (req.method ==='POST') {
    console.log('a third test string')
    req.on("data", data => {
  //    console.log('this is a test string');
      console.log(data);
      body += data;
    })

    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "text/html" });
      console.log(body)
      res.end(html);
    });
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
