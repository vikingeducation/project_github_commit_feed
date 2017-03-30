var Github = require('github');

class GithubWrapper {
  constructor(apikey){
    this.github = new Github;
    this.apikey = apikey;
  }
  authenticate(){
    this.github.authenticate({
      type: "token",
      token: this.apikey
    })
  }
  getCommits(obj, callback){
    this.github.repos.getCommits(obj, callback)
  }
}

module.exports = GithubWrapper;