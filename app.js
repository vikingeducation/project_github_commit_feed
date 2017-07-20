const http = require('http');
const fs = require('fs');
const commits = require('./data/commits.json')

//console.log(JSON.stringify(commits, null, 2))

// JSON.stringify(commits, null, 2)




const hostname = '127.0.0.1';
const port = 3000;

var html = fs.readFileSync('./public/index.html', 'utf8');


html = html.replace('{{commitFeed}}', JSON.stringify(commits, null, 2))


const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


