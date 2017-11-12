const http = require('http');
const fs = require('fs');
const router = require('./router');
const url = require('url');

var port = 3100;
var host = 'localhost';


const server = http.createServer( (req, res) => {
  var body = '';
  var css = '';
  // var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;
  if ( path == '/') {
    var p = new Promise( (resolve, reject) => {
      fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw reject(err);
        body += data;
        resolve(body);
      })
      // fs.readFile('./public/main.css', 'utf8', (err, data) => {
      //   if (err) throw reject(err);
      //   css += data;
      //
      //   res.end();
      // })
    });
    p.then( function(body) {
      callback(req, res, body, css);
    })
  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
})


var callback = (req, res, body, css) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // res.writeHead(200, {'Content-Type': 'text/css'});
  // res.write(css);
  res.write(body);
  res.end();
}

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`)
})
