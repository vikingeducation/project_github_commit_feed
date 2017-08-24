var http = require('http');
var router = require('./modules/router');

var app = () => {
  var port = 3000;

  var server = http.createServer(router.handle);

  server.listen(port, function() {
    console.log('Server working at http://localhost:' + port);
  });


}

app();
