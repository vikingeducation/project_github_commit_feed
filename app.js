'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const commitFeed = require('./data/commits');
const gitHubWrapper = require('./github_wrapper');

var port = 3100;
var host = 'localhost';


const server = http.createServer( (req, res) => {
  var body = '';
  var css = '';
  var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;
  if ( path == '/') {
    var p = new Promise( (resolve, reject) => {
      var jsonStr = JSON.stringify(commitFeed, null, 2)
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
          json = scrubber(json);
          saveToFile(json);
          body = body.replace(/{{ commitFeed }}/, JSON.stringify(json, null, 2) );
          resolve(body);
        })
      })
    })
    p.then( function(body) {
      gitCallback(req, res, body);
    })
    
  } else if (path == '/github/webhooks') {
      var webhooksData = '';
      req.on('data', (data) => {
        webhooksData += data;
      })
      req.on('end', () => {
        debugger
        if (req.headers['Content-Type'] === 'application/json') {
          console.log('slicing data');
           jsonData = JSON.parse(webhooksData.slice(8));
           var jsonStr = gitHubWrapper(webhookData.pusher.name, webhookData.repository.name);
           json = scrubber(json);
           saveToFile(json);
        }
        console.log('FInsihing savinf file.')
        res.end('200 OK');
      });
      var newUrl = url.parse(req.url).query;

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

var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

var callback = (req, res, body, css) => {
  res.writeHead(200, _headers);
  res.write(body);
  res.end();
}


var postCallback = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.body);
  res.end();
}

var gitCallback = (req, res, body) => {
  res.writeHead(200, _headers);
  res.write(body);
  res.end();
}

var scrubber = (json) => {
  return json['data'].map( (commitData) => {
    return {
      'message': commitData.commit.message,
      'author': commitData.commit.author,
      'url': commitData.url,
      'sha': commitData.sha
    }
  })
}

var saveToFile = (newJson) => {
  debugger;
  var fileContent = commitFeed;
  newJson.forEach( (el) => {
    fileContent.push(el)
  })
  console.log(fileContent)
  fs.writeFile("./data/commits.json", JSON.stringify(fileContent, null, 2), function(err) {
    if(err) return console.log(err);
    console.log("The file was saved!");
  });
}

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`)
})
