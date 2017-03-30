var fs = require('fs');
var githubParser = {
  parse: function(res){
    output = {};
    output.commits=[];
    res.data.forEach(function(commit){
        output.commits.push({
          message: commit.commit.message,
          author: commit.author.login,
          html_url: commit.html_url,
          sha: commit.sha
        })
    })
    fs.writeFileSync('./data/commits.json', JSON.stringify(output))
  }
}

module.exports = githubParser;