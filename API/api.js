var Github = require('github')
var git = Github()



class Gitwrap {
    constructor(token,repo,owner) {



 git.authenticate({
        type: 'token',
        token: '6c5e98cc360a8d6b5646d94f5ad9f06f121ceaf4'
    })
 
    git.repos.getCommits({owner: 'eliashantula',
        repo: 'assignment_jq_dom_sprint'}, function(err,data){
        console.log(data);
  })
    }
}


module.exports Gitwrap