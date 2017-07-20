const github = require('./lib/github');
// do something

github('project_github_commit_feed', 'thebopshoobop')
	.then(data => {
		console.log(data);
	})
	.catch(err => {
		console.error(err);
	});
