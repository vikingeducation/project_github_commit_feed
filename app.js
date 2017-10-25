'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./lib/github-wrapper');

const hostname = 'localhost';
const port = 3000;

const contentFile = './data/commits.json';
const noContent = '';
const _headers = {
	"Content-Type": "text/html",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

// const express = require('./lib/express');
// const app = express();

//
//create routes here
//
// app.post('/github/webhooks', (req, res) => {
// 	let data = req.body;	

// 	if (req.headers['content-type'] === 'application/json') {
// 		data = JSON.parse(req.body);
// 		data = JSON.stringify(data, null, 2);
// 	}
// 	res.end(data);
// });

let render = (res, fileContents, replacement) => {
	res.writeHead(200, _headers);
	let content = fileContents.replace('{{ commitFeed }}', replacement);
	res.end(content);	
};

const fileNotFound = (res) => {
	res.writeHead(404);
	res.end("404 Not Found");
};

//
//handle all incoming HTTP requests here
//
let routerHandle = (req, res) => {
	let htmlPath = __dirname + '/public/index.html';
	fs.readFile(htmlPath, 'utf8', (err, fileContents) => {
		if (err) {
			fileNotFound(res);
		} else {
			let queryString = url.parse(req.url).query;
			if (queryString) {
				fetchRepoCommits(queryString, res, fileContents);
			} else {
				render(res, fileContents, noContent);
			}
		}
	});
};

let fetchRepoCommits = (queryString, res, fileContents) => {
	github.authenticate(process.env.GITHUB_ACCESS_TOKEN);

	let params = getParams(queryString);
	// console.log(`user = ${params[1]} and repo = ${params[2]}`);
	let githubParams = {owner: params[1], repo: params[2] };
	github.getRepoCommits(githubParams)
	.then(result => {
		//console.log(res.data[0].commit); // traversing the object returned from github
		let scrubbedResult = scrub(result.data);
		let content = JSON.stringify(scrubbedResult, null, 2);
		return doWriting(contentFile, content);
	}).then(result => {
		console.log(result);
		return reReadFile(contentFile);
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

let catchError = (err) => {
	console.log(err);
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
