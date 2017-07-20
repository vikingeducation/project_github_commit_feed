const http = require("http");
const url = require("url");

const Router = {
  routes: {},
  params: {}
};

// Handle requests.
Router.handle = function handle(req, res) {
  console.log("**** Handling Request ****");

  const verb = req.method.toLowerCase();
  const path = _trimPath(req);

  // Get data.
  new Promise(resolve => {
    verb !== "get" ? _getData(req, resolve) : resolve();
  })
    .then(result => {
      _route(req, res, verb, path);
    })
    .catch(err => {
      res.statusCode = 500;
      res.end("500 Internal Server Error");
    });
};

Router.listen = function(port, host, callback) {
  http.createServer(Router.handle).listen(port, host, callback);
};

function _trimPath(req) {
   let path = url.parse(req.url).pathname.trim();
  return path.length > 1 && path[path.length - 1] === '/' ?
        path = path.slice(0, path.length -1) : path;
}

function _getData(req, resolve) {
  let body = "";
  req.on("data", body.concat);
  req.on("end", () => {
    req.body = body;
    resolve();
  });
}

function _route(req, res, verb, path) {
  pathKey = _matchPath(req, verb, path);

  if (pathKey) {
    Router.routes[verb][pathKey](req, res);
  } else {
    res.statusCode = 404;
    res.end("404 Not Found");
  }
}

function _matchPath(req, verb, path) {
  let foundPath = null;
  for (let pathKey in Router.routes[verb]) {
    let pathRegex = new RegExp(pathKey);
    if (pathRegex.test(path)) {
      _getParams(req, verb, path, pathKey);
      foundPath = pathKey;
      break;
    }
  }
  return foundPath;
}

function _getParams(req, verb, path, pathKey) {
  // {0: 'name', 2: 'pet'}
  const registeredParams = Router.params[verb][pathKey];
  // ['bob', 'has', 'cat']

  const pathSections = path.split("/").slice(1);

  let params = {};
  for (let index in registeredParams) {
    // {'name': 'bob', 'pet': 'cat'}
    params[registeredParams[index]] = pathSections[index];
  }
  req.params = params;
}

module.exports = Router;
