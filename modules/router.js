var routes = require('./routes');

var router = {

  handle: function (req, res) {

      if (routes[req.method.toLowerCase()][req.url]) {
        routes[req.method.toLowerCase()][req.url](req,res);
      }
      else {
        console.log(req.method, req.url,  "oops");
      }
  }

}

module.exports=router;
