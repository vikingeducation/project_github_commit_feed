var url = require('url');

var Router = {};

Router.methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
];
Router.routes = {};

var _extractPostData = (req, done) => {
  var body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
}

Router.methods.forEach((method) => {
  Router.routes[method] = Router.routes[method] || {};

  Router[method] = (path, callback) => {
    Router.routes[method][path] = callback;
  }
});


Router.routes['get'] = {};
Router.routes['get']['/'] = (req, res) => {
  res.end();
}


Router.handle = (req, res) => {
  var method = req.method.toLowerCase();
  var path = url.parse(req.url).pathname;

  if (Router.routes[method][path]) {

    var p = new Promise( (resolve ) => {
      if (method !== 'get') {
        _extractPostData(req, resolve);
      } else {
        resolve();
      }
    });

    p.then( function() {
      Router.routes[method][pathPattern](req, res);
    })

  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
};



module.exports = Router;
