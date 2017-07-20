const http = require('http');
const url = require('url');

//collect data from request body
function _getData(req, resolve) {
  let body = '';
  req.on('data', data => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    resolve();
  });
}

// Set the query object for a given path
function _getQueryParams(req) {
  const queryUrl = url.parse(req.url, true);
  req.query = queryUrl.query;
}

// Set the parameter object for a given route from the path params
function _getPathParams(req, verb, path, pathKey) {
  // {0: 'name', 2: 'pet'}
  const registeredParams = Router.params[verb][pathKey];
  // ['bob', 'has', 'cat']
  const pathSections = path.split('/').slice(1);

  let params = {};
  for (let index in registeredParams) {
    // {'name': 'bob', 'pet': 'cat'}
    params[registeredParams[index]] = pathSections[index];
  }
  req.params = params;
}

// Try to find a matching route for a given request
function _matchPath(req, verb, path) {
  let foundPath = null;
  for (let pathKey in Router.routes[verb]) {
    let pathRegex = new RegExp(pathKey);
    if (pathRegex.test(path)) {
      _getPathParams(req, verb, path, pathKey);
      foundPath = pathKey;
      break;
    }
  }
  return foundPath;
}

// Given a verb and path, search for a registeed route
// 404 if we don't have one
function _route(req, res, verb, path) {
  pathKey = _matchPath(req, verb, path);
  if (pathKey) {
    Router.routes[verb][pathKey](req, res);
  } else {
    res.statusCode = 404;
    res.end('404 NOT FOUND, LOSER\n');
  }
}

// Given a request object, return a sanitized path
function _trimPath(req) {
  let path = url.parse(req.url);
  path = path.pathname.trim();
  if (path.length > 1 && path[path.length - 1] === '/') {
    path = path.slice(0, path.length - 1);
  }
  return path;
}

// Define our router
const Router = {
  routes: {},
  params: {}
};

// Handle requests
Router.handle = function handle(req, res) {
  console.log('****Handling Request*****');

  const verb = req.method.toLowerCase();
  const path = _trimPath(req);

  // Get query params
  _getQueryParams(req);

  // Get data
  let p = new Promise((resolve, reject) => {
    if (verb !== 'get') {
      _getData(req, resolve);
    } else {
      resolve();
    }
  });

  // Route
  p
    .then(() => {
      _route(req, res, verb, path);
    })
    .catch(err => {
      console.log('Error! Routing failed:');
      console.log(err);
      res.statusCode = 500;
      res.end('<h1>500 Internal Server Conflagration!</h1>\n');
    });
};

// Instatiate server
Router.listen = function(port, host, callback) {
  let server = http.createServer(Router.handle);
  server.listen(port, host, callback);
};

module.exports = Router;
