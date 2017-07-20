const parsePaths = require("./parsePaths");
const Router = require("./router");

// Build HTTP verb methods
const verbs = ["get", "post", "put", "patch", "delete"];
verbs.forEach(verb => {
  Router.routes[verb] = Router.routes[verb] || {};
  Router.params[verb] = Router.params[verb] || {};

  Router[verb] = (path, callback) => {
    let [pathRegex, pathParams] = parsePaths(path);
    Router.routes[verb][pathRegex] = callback;
    Router.params[verb][pathRegex] = pathParams;
  };
});

module.exports = Router;
