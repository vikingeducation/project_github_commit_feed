var url = require('url');

let Router.routes = {};


Router.handle = (req, res) => {

  var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;
  console.log(path);
  if (Router.routes[method][path]) {
    Router.routes[method][path](req, res);
  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
};

module.exports = Router;
