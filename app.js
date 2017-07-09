var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res) => {
  var file = fs.readFileSync('./public/index.html');
  res.writeHead(200, {contentType: 'application/html'});
  res.end(file);
});

server.listen(3000, 'localhost', (() => {
  console.log('Starting up your server Sir!')
}))