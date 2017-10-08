const http = require('http');
const fs = require('fs');
const router = require('./src/router.js');


const server = http.createServer(router.handleReq);



server.listen(3000, () => {
  console.log('Listening to port 3000');
});
