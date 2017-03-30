const http = require("http");
const fs = require("fs");
const commits = require("./data/commits");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      throw err;
    }
    let regex = /commitFeed/;
    res.end(data.toString().replace(regex, JSON.stringify(commits, null, 2)));
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
