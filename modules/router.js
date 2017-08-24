var routes = require('./routes');
var url = require('url');

var router = {

  handle: function (req, res) {
      var path = (url.parse(req.url).pathname);
      if (routes[req.method.toLowerCase()][path]) {
        routes[req.method.toLowerCase()][path](req,res);
      }
      else {
        console.log(req.method, req.url,  "oops");
      }
  }

}

module.exports=router;
