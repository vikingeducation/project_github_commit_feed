let http = require("http");
let router = require("./router.js");

let express = () => {
  var app = {
    listen: function(port, host, callback) {
      let server = http.createServer(router.handle);
      server.listen(port, host, callback);
    },
    get: (path, callback) => {
      router.updates(path, callback, "get");
    },
    post: (path, callback) => {
      router.updates(path, callback, "post");
    }
  };
  return app;
};

module.exports = express;
