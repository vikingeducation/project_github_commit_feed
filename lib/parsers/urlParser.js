const url = require('url');

var urlParser = {
  parse: function(req){
    var params = {};
    var parsedUrl= url.parse(req.url);

    if(parsedUrl.pathname === '/commits'){
      var repo = new RegExp('.*repo=(.*)');
      var user = new RegExp('user=(.*)\&');
      params.repo =  parsedUrl.query.match(repo)[1]
      params.user =  parsedUrl.query.match(user)[1]
    }
    return params;
  }
}

module.exports = urlParser
