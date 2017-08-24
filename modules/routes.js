var fs = require('fs');
var github = require('../lib/github_wrapper');



var routesInit = function () {
  var routes = {};

  routes.get = (path, callback) => {
    routes.get[path] = callback;
  };

  routes.post = (path, callback) => {
    routes.post[path] = callback;
  }

  routes.get('/', function (req,res){
    fs.readFile('./public/index.html', "utf8", function(err,data){
      if(err){
        throw err;
      }
      fs.readFile('./data/commits.json', "utf8", function(err2, data2){
        if (err2) {
          throw err2;
        }
        var stringedData = data.toString();
        data  = stringedData.replace( '{{ commitFeed }}', data2);

        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length':data.length});
        res.write(data);
        res.end();
      })
    })
  })

  routes.get('/stylesheets/bootstrap.css', function (req,res){
    fs.readFile('./public/stylesheets/bootstrap.min.css', function(err,data){
      res.writeHead(200, {'Content-Type': 'text/css',  'Content-Length':data.length});
      res.write(data);
      res.end();
    })
  })


  routes.get('/commits', function (req,res){
    var regex = /=(\w+)/g;
    var matchs = (req.url).match(regex);
    if (matchs != null) {
      var user = matchs[0].slice(1);
      var repo = matchs[1].slice(1);
      github(user, repo , function () {
        routes.get['/'](req,res);
      });

    }
    else {
      routes.get['/'](req,res);
    }
  })

  routes.post('/', function (req,res){
    var data = "";
    req.on('data', function(chunck){
      data += chunck.toString('utf8');
    })
    req.on('end', function(){
      data = data.slice(7);
      data = decodeURIComponent(data);
      
      console.log(data);
      res.end('200 OK')
    })
  })
  return routes;
}


module.exports = routesInit();
