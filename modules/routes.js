var fs = require('fs');

var routes = {};

routes.get = (path, callback) => {
  routes.get[path] = callback;
};

routes.get('/', function (req,res){
  fs.readFile('./public/index.html', function(err,data){
    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length':data.length});
    res.write(data);
    res.end();
  })
})

routes.get('/stylesheets/bootstrap.css', function (req,res){
  fs.readFile('./public/stylesheets/bootstrap.min.css', function(err,data){
    res.writeHead(200, {'Content-Type': 'text/css',  'Content-Length':data.length});
    res.write(data);
    res.end();
  })
})


module.exports = routes;
