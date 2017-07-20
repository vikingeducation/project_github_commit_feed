const http = require("http");
const url = require("url");
const app = require("./lib/routeInit.js");
const apiWrapper = require("./lib/apiWrapper");
const render = require("./lib/render");
const fs = require('fs');

const PORT = process.env.port || process.argv[2] || 3000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.statusCode = 200;
  render("index.html", []).then(result => {
    res.end(result);
  });
});

app.get("/:username/:repository", (req, res) => {
  // Authenticate with github using our token
  apiWrapper.authenticate();

  apiWrapper.getCommits().then(apiWrapper.parseData).then(
    results => {
      res.statusCode = 200;
      render("index.html", results).then(result => {
        res.end(result);
      });
    }, console.log);
});

// TODO: NEED TO ACCEPT PATTERNS SO THAT CLIENT CAN REQUEST ANY STYLESHEET
app.get('/public/stylesheets/style.css', (req, res) => {
  fs.readFile('./public/stylesheets/style.css', (err, data) => {
    if (err) throw err;
    res.writeHead(200, {
      "Content-Type": "text/css"
    });
    res.end(data);
  });
});

// TODO: NEED TO ACCEPT PATTERNS SO THAT CLIENT CAN REQUEST ANY JAVASCRIPT
app.get('/public/javascripts/script.js', (req, res) => {
  fs.readFile('./public/javascripts/script.js', (err, data) => {
    if (err) throw err;
    res.writeHead(200, {
      "Content-Type": "text/javascript"
    });
    res.end(data);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
