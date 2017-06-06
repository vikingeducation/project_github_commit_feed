let githubWrapper = require('./modules/github_wrapper.js')

githubWrapper.init();
githubWrapper.getCommits('malbaron0', 'project_github_commit_feed' , (err,res) => {
    console.log(res);
});