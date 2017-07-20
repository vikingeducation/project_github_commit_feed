const http = require('http');
const commits = require('./data/commits');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found!');
      console.error(err);
    }

    let decodedData = data.toString();
    let pageContents = decodedData.replace(
      '{{commits}}',
      JSON.stringify(commits, null, 2)
    );

    let queryUrl = url.parse(req.url, true);
    console.log(queryUrl.query);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(pageContents);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
