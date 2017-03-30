var github_api = require('./githubAPI');

github_api.getCommits({owner: "William-Charles", repo: "assignment_node_dictionary_reader"}, function(data) {
  console.log(data);
});