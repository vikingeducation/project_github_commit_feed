const githubWrapper = require('./lib/github');


githubWrapper.init();
githubWrapper.authenticate(process.env.GITHUB_API_KEY);
githubWrapper.getRepoCommits("christianflorez", "assignment_building_the_express_router", (err, res) => {
  console.log(res);
});