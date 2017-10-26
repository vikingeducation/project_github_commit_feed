'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./lib/github-wrapper');

const hostname = 'localhost';
const port = 3000;

const HTML_PATH = __dirname + '/public/index.html';
const CONTENT_PATH = './data/commits.json';
const NO_CONTENT = '';
const WEBHOOKS_HEADERS = {
	"Content-Type": "text/html",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

let render = (res, fileContents, replacement) => {
	res.writeHead(200, WEBHOOKS_HEADERS);
	let content = fileContents.replace('{{ commitFeed }}', replacement);
	console.log(content);
	res.end(content);	
};

const fileNotFound = (res) => {
	res.writeHead(404);
	res.end("404 Not Found");
};

let _extractPostData = (req, callback) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = JSON.parse(body);
    callback();
  });
};

//
//handle all incoming HTTP requests here
//
let routerHandle = (req, res) => {
	let method = req.method.toLowerCase();
	let path = url.parse(req.url).pathname;
	// console.log(method); console.log(path);

	fs.readFile(HTML_PATH, 'utf8', (err, fileContents) => {
		if (err) {
			fileNotFound(res);
		} else {
			if (method === 'get') {
				let queryString = url.parse(req.url).query;
				if (queryString) {
					let params = getParams(queryString);
					// console.log(`user = ${params[1]} and repo = ${params[2]}`);
					let githubParams = {owner: params[1], repo: params[2] };					
					fetchRepoCommits(githubParams, res, fileContents);
				} else {
					render(res, fileContents, NO_CONTENT);
				}
			} else if ( (method === 'post') && (path === '/github/webhooks') ) {
				extractPostData(req)
				.then( () => {
					// console.log(req.body.pusher.name); console.log(req.body.repository.name);
					let githubParams = {owner: req.body.pusher.name, repo: req.body.repository.name };					
					fetchRepoCommits(githubParams, res, fileContents);
				})
				.catch(catchError);
			}
		}
	});
};

let catchError = (err) => {
	console.log(err);
};

let extractPostData = (req) => {
	return new Promise( (resolve, reject) => {
		_extractPostData(req, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

let fetchRepoCommits = (githubParams, res, fileContents) => {
	github.authenticate(process.env.GITHUB_ACCESS_TOKEN);
	github.getRepoCommits(githubParams)
	.then(result => {
		//console.log(res.data[0].commit); // traversing the object returned from github
		let scrubbedResult = scrub(result.data);
		let content = JSON.stringify(scrubbedResult, null, 2);
		return doWriting(CONTENT_PATH, content);
	}).then(result => {
		console.log(result);
		return reReadFile(CONTENT_PATH);
	}).then(result => {
		render(res, fileContents, result);
	}).catch(catchError);	
};

let doWriting = (path, fileContents) => {
//	fs.appendFile(path, fileContents, 'utf8', (err) => {
	return new Promise( (resolve, reject) => {
		fs.writeFile(path, fileContents, 'utf8', (err) => {
			if (err) reject(err);
			resolve('Write / overwrite successful!');
		});		
	});
};

let reReadFile = (path) => {
	return new Promise( (resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

//takes an array and returns an object
let _objectify = (myArray) => {
	//keeping object structures consistent with Viking
	let myObject = {};
	myObject.foobar = myArray;	
	let myFinalObject = {};
	myFinalObject.Foobar = myObject;	
	return myFinalObject;
};

let scrub = (result) => {
	// console.log(result);
	const newResult = result.map( (element) => {
		const { commit: {author, message, url, sha} } = element; // my first destructuring
		return {
			author: author,
			message: message,
			url: url,
			sha: sha
		};
	});
	// console.log(newResult);
	return _objectify(newResult);
};

let getParams = (url) => {
	let regex = /user=(\w+)&repo=(\w+)/g;
	let params = regex.exec(url);
	return params;
};

const server = http.createServer( routerHandle );

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
