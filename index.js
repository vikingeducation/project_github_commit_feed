const http = require("http");
const url = require("url");
const app = require("./lib/routeInit.js");

const PORT = process.env.port || process.argv[2] || 3000;
const HOST = "localhost";

app.get("/", (req, res) => {
  // apiWrapper.authenticate();
  // apiWrapper.getCommits().then(results => {
  //   res.statusCode = 200;
  //
  //   // read in the file we need to display (index.html)
  //
  //   res.end();
  //
  //   // res.render('index', {
  //   //   title: 'Github Commit Feed',
  //   //   commits: apiWrapper.parseData(results.data)
  //   // });
  // });
});

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
