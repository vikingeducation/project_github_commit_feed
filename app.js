const http = require('http');
const fs = require('fs');
const url = require('url');

const host = "localhost";
const port = 3000;

const commitsJSON = require('./data/commits.json')
var commits = JSON.stringify(commitsJSON, null, 2)

const server = http.createServer((req, res) => {

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 not found');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      if (url.parse(req.url).pathname === '/commits'){
        console.log("/commits is being called =>", url.parse(req.url))
        console.log('/commits  params =>', url.parse(req.url, true).query)
        let formData = url.parse(req.url, true).query
        console.log("params", formData);

      }
      // console.log(url.parse(req.url, true))
      data = data.toString().replace( '{{ commitFeed }}', commits)
      res.end(data);
    });
  });

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
