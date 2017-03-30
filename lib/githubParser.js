var githubParser = {
  parse: function(res){
    res.data.forEach(function(commit){
      console.log(Object.keys(commit))
    })
      console.log('Response: ' + res.data);
  }
}

module.exports = githubParser;