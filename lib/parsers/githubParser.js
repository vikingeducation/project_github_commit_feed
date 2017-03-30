var fs = require('fs');
var githubParser = {
  parse: function(res){
    let output = {};
    output.commits=[];
    res.data.forEach(function(commit){
        output.commits.push({
          message: commit.commit.message,
          author: commit.author.login,
          html_url: commit.html_url,
          sha: commit.sha
        })
    })
    console.log("is this working!!!!!?")
    return new Promise((resolve) => {
      fs.writeFile('./data/commits.json', JSON.stringify(output, null, 2), function(err){
        resolve(output);
      })
    })
  }
}

module.exports = githubParser;