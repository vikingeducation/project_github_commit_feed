var urlParser = require('./urlParser');
var githubParser = require('./githubParser');

// Github vars
var apikey = process.env.githubKey;
var GithubWrapper = require('../GithubWrapper');
var githubWrapper = new GithubWrapper(apikey);
githubWrapper.authenticate();

var request = {
  parse: function(req){
    return new Promise( (resolve) => {
      var parsedParams = urlParser.parse(req);
      if(parsedParams.user && parsedParams.repo){
        let username = parsedParams.user;
        let repo = parsedParams.repo;
        githubWrapper.getCommits(
        {
          owner: username,
          repo: repo
        }, function(err, res){
            githubParser.parse(res).then(function(obj){
              resolve();
            })
        });
      } else {
        resolve();
      }
    })
  }
}

module.exports = request;