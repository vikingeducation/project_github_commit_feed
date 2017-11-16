'use strict';
const gitApi = require('./API/api.js');
const http = require('http');
const fs = require('fs');
const url = require('url');
const data1 = require('./data/commits.json');
const Router = {};

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;
  Router.routes[method][path](req, res);
};

Router.routes = {
  get: {
    '/': (req, res) => {
      fs.readFile('./views/index.html', function(err, html) {
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        let data = JSON.stringify(data1, null, 2);

        res.write(html.toString().replace(/{{commitfeed}}/, data));
        res.end();
      });
    }
  },
  post: {
    '/': (req, res) => {
      postData(req, res);
    }
  }
};

let postData = (req, res) => {
  var body = '';

  // Every time a data event is fired
  // we concat the next chunk of data
  // to the string
  req.on('data', data => {
    body += data;
  });

  // When the end event is fired
  // we know we have all the data
  // and can send back a response
  console.log(req.headers['content-type']);
  console.log('It no work');
  // return body;
};

// Output the POST data

module.exports = Router;
