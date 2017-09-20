let url = require("url");

const Router = {};

Router.routes = {
  get: {},
  post: {}
};

Router.updates = function(path, callback, method) {
  Router.routes[method][path] = callback;
};

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;
  // returns the matches object from the parser. that object will validate that the route is correct and pass back a params object if route was parameterized.
  // let matches = parser(Router.routes, path, method);
  if (Router.routes[method][path] && path !== "/favicon.ico") {
    Router.routes[method][path](req, res);
  }
};
module.exports = Router;
