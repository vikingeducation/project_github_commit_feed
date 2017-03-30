let http = require('http');

function server(){
  function listen(port, host, callback){
  const serve = http.createServer(Router.handle);
  serve.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
  });
  }

  function get(path, callback){
  Router.get(path, callback)
  }

  return {
  listen: listen,
  get: get
  }
}

module.exports = server;