var githubWrapper = require('./lib/githubWrapper');

var userInfo = githubWrapper.setUserInfo('throw22', 'assignment_js_sprint');
githubWrapper.getCommits(userInfo);

//For testing: ngrok http 3000
