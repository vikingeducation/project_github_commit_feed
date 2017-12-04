const http = require('http');

var router = require('./lib/router');

http.createServer(router.handle).listen(3000);