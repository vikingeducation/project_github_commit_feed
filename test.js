var github_wrapper = require("./github_wrapper");

github_wrapper.getCommits(
  { owner: "William-Charles", repo: "assignment_node_dictionary_reader" },
  function(data) {
    console.log(data);
  }
);
