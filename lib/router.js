var Router = {};
var url = require('url');
var GETListener = require('./routes');


// Supported route methods
Router.methods = [
   'get',
   'post', 
   'put',
   'patch',
   'delete'
]

// Object to hold registered routes
Router.routes = {};

Router.methods.forEach((method) => {
   // Initialize key in routes if it hasn't yet
   Router.routes[method] = Router.routes[method] || {};

   // Add callback to method using path as key to callback
   Router.routes[method] = (path, callback) => {
      Router.routes[method][path] = callback;
   };
});

// Register callbacks for paths and HTTP verbs
Router.routes.post['/github/webhooks'] = (req, res) => {
   var body = '';
   req.on('data', (data) => {
      body += data;
   });
   req.on('end', () => {
      req.body = body;
   });
   res.end(body);
};

// Handles all incoming HTTP requests
Router.handle = (req, res) => {
   // Get request's method
   var method = req.method.toLowerCase();
  
   // Get URL path
   var path = url.parse(req.url).pathname;
   
   // If route is a GET method
   if (method === 'get') {
      GETListener(req, res);
   } else {
   
      // If route is found
      if (Router.routes[method][path] && (method !== 'get')) {
         // Respond with correct handler
         Router.routes[method][path](req, res);
      } else {
         // If handler is not found
         res.statusCode = 404;
         res.end('404 Not Found');
      }
   }
};

module.exports = Router;