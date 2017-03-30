var apikey = process.env.githubKey;
var Github = require('github');
var github = new Github;


function GitApi(){
 
	authenticate: function() {
	    type: "token",
	    token: apikey,
		});
 	},

 	github.repos.getCommits(
	  {
	    owner: 'tim5046',
	    repo: 'assignment_githuh'
	  }, function(err, res){
	    res.data.forEach(function(wtf){
	      console.log(Object.keys(wtf))
	    })
	      console.log('Response: ' + res.data);
	  }
	),

  return {
  
  }
}

module.exports = GitApi;