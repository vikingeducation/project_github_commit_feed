var githubWrapper = require('./lib/github_wrapper');

githubWrapper.getCommits("tketron", "assignment_building_the_express_router").then(data => console.log(data)).catch(err => console.log(err));
