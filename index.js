var githubWrapper = require('./lib/githubWrapper');

githubWrapper.userInfo.owner = 'throw22';
githubWrapper.userInfo.repo = 'assignment_js_sprint';

githubWrapper.getCommits(githubWrapper.userInfo);
