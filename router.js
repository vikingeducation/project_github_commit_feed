const http = require('http');
const fs = require('fs');

const Router = {};

Router.handle = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello All');
};

Router.methods = ['get', 'post'];

Router.routes = {};
module.exports = Router;
