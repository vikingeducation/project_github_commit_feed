'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const commitFeed = require('./data/commits');
const gitHubWrapper = require('./github_wrapper');
// const router = require('./router');

var port = 3100;
var host = 'localhost';




const server = http.createServer( (req, res) => {
  var body = '';
  var css = '';
  var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;
  console.log(path);
  if ( path == '/') {
    var jsonStr = JSON.stringify(commitFeed, null, 2)
    var p = new Promise( (resolve, reject) => {
      fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw reject(err);
        body += data;
        body = body.replace(/{{ commitFeed }}/, jsonStr);
        resolve(body);
      })
    });
    p.then( function(body) {
      callback(req, res, body, css);
    })
  } else if (path == '/commits') {
    var p = new Promise( (resolve, reject) => {
      fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw reject(err);
        var newUrl = url.parse(req.url).query;
        var params = strParser(newUrl);
        var jsonStr = gitHubWrapper(params.username, params.repo);
        body += data;
        jsonStr.then(json => {
          body = body.replace(/{{ commitFeed }}/, JSON.stringify(json, null, 2) );
          console.log('body is: ' + body);
          resolve(body);
        })
      })
    })
    p.then( function(body) {
      gitCallback(req, res, body);
    })
  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
})

var strParser = (query) => {
  var params = {};
  var str = query.split('&');
  str.forEach( (el) => {
    params[el.split('=')[0]] = el.split('=')[1];
  })
  return params;
}


var callback = (req, res, body, css) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
}

var postCallback = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.body);
  res.end();
}

var gitCallback = (req, res, body) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
}

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`)
})
