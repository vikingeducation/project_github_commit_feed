const http = require('http');
const url = require('url');
const handleHomePage = require('./view');
const handleWebHooks = require('./webhooks');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // setting up router
  const path = url.parse(req.url).pathname;

  if (path === '/') {
    handleHomePage(req, res);

  } else if (path === '/github/webhooks') {
    handleWebHooks(req, res);
  }
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

