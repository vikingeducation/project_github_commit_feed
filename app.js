let githubWrapper = require('./lib/githubWrapper');
const http = require('http');
const fs = require('fs');

let userInfo = githubWrapper.setUserInfo('nicoasp', 'assignment_js_sprint');
githubWrapper.getCommits(userInfo).then((data) => {
	console.log(data);
});

//For testing: ngrok http 3000

let server = http.createServer(function(req, res) {
	fs.readFile('./public/index.html', 'utf-8', function(data) {
		res.
		res.end('data');
	});
})