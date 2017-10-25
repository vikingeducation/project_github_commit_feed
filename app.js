'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./lib/github-wrapper');

const myJsonFile = './data/commits.json';
const hostname = 'localhost';
const port = 4000;

github.authenticate(process.env.GITHUB_ACCESS_TOKEN);

const server = http.createServer( (req, res) => {
	let htmlPath = __dirname + '/public/index.html';
	fs.readFile(htmlPath, 'utf8', (err, readFileContents) => {
		if (err) {
			res.writeHead(404);
			res.end("404 Not Found");
		} else {
			let queryString = url.parse(req.url).query;
			if (queryString) {
				let params = getParams(queryString);
				// console.log(`user = ${params[1]} and repo = ${params[2]}`);
				let githubParams = {owner: params[1], repo: params[2] };
 				let p1 = github.getRepoCommits(githubParams);
				p1.then(result => {
					//console.log(res.data[0].commit); // traversing the object returned from github
					let trimmedResult = github.trimMeDown(result.data);
					let trimmedResultStringified = JSON.stringify(trimmedResult, null, " ");
					let p2 = github.doWriting(myJsonFile, trimmedResultStringified);
					return p2;
				}).then(result => {
					let p3 = github.reReadFile(myJsonFile);
					return p3;
				}).then(result => {
					res.writeHead(200, {"Content-Type": "text/html"});
					let goodToGo = readFileContents.replace('{{ commitFeed }}', result);
					res.end(goodToGo);	
				}).catch(catchError);
			} else {
		 		res.writeHead(200, {"Content-Type": "text/html"});
				let noContent = readFileContents.replace('{{ commitFeed }}', '');
				res.end(noContent);					
			}
		}
	});
});

let catchError = (err) => {
	console.log(err);
};

let getParams = (url) => {
	let regex = /user=(\w+)&repo=(\w+)/g;
	let params = regex.exec(url);
	return params;
};

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
