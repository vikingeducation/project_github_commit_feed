var github = require("./lib/github");
fs = require("fs");
var http = require('http');
let url = require('url');

var commits = github.githubCommits(
  "GeneTinderholm",
  "project_github_commit_feed"
);

var server = http.createServer((req, res)=> {
	path = url.parse(req.url).pathname;
  if(path === '/'){
  		displayRoot(req, res);
  	}else if(path === '/commits'){
  		displayCommits(req, res);
  	}
  });
server.listen(3000, 'localhost');
let displayRoot = (req, res) => {
	fs.readFile('./public/index.html', 'utf8', (err, data) => {
		if(err){
			res.statusCode = 404;
			res.end('404');
		} else {
			let body = '';
			req.on('data', data => {
				body += data;
			})
			req.on('end', () =>{
				req.body = (body);
				github.githubCommits(req.query)
				  .then((err, data) => {
				  	if(err){
				  		throw err;
				  	} else {
				  		res.statusCode = 200;
				  		let jData = JSON.stringify(data);
				  		let body2 = body.replace('{{commitData}}', jData);
				  		res.end(body2);
				  	}
				  })
			})
		}
	});
}

var displayCommits = (req, res)=>{
	fs.readFile('./public/index.html', 'utf8', (err, data) => {
		if(err){
			res.end('404');
		} else {
			req.quer
			res.end(data);
		}
	});
}
commits
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
var appObj;
module.exports = appObj;
