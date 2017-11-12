const http = require('http');
const fs = require('fs');
const url = require('url');
const commitFeed = require('./data/commits');
// const router = require('./router');

var port = 3100;
var host = 'localhost';




const server = http.createServer( (req, res) => {
  var body = '';
  var css = '';
  var jsonStr = JSON.stringify(commitFeed, null, 2)
  var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;
  console.log(path);
  if ( path == '/') {
    var p = new Promise( (resolve, reject) => {
      fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw reject(err);
        body += data;
        body = body.replace(/{{ commitFeed }}/, jsonStr);
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
  } else if (path == '/commits') {
    // var p = new Promise( (resolve) => {
    //   _extractPostData(req, resolve)
    // })
    // p.then( () => {
    //   postCallback(req, res);
    // })
    var newUrl = url.parse(req.url).query;
    var params = strParser(newUrl);
    console.log(params);
    res.write(params.toString());
    res.end();
  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
})

var strParser = (query) => {
  var params = {};
  str = query.split('&');
  str.forEach( (el) => {
    params[el.split('=')[0]] = el.split('=')[1];
  })
  return params;
}


var callback = (req, res, body, css) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // res.writeHead(200, {'Content-Type': 'text/css'});
  // res.write(css);
  res.write(body);
  res.end();
}

var postCallback = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.body);
  res.end();
}

// var _extractPostData = (req, done) => {
//   var body = '';
//   req.on('data', (data) => {
//     body += data;
//   })
//   req.on('end', () => {
//     req.body = body;
//     done(body);
//   })
// }

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`)
})
