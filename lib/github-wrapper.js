'use strict';

let fs = require('fs');

//used for coveyes to verify first cert, else comment out. (most likely you do not have coveyes)
require('../coveyes/coveyes');

const GitHubApi = require('github');
const github = new GitHubApi();

let authenticate = (token) => {
	github.authenticate({
	    type: "token",
	    token: token
	});
};

//option1: using promises
let getRepoCommits = (params) => {
	return new Promise( (resolve, reject) => {
		github.repos.getCommits(params, (err, result) => { // getting back res (object of info from github)
			if (err) reject(err);
			resolve(result);
		});
	});
	// p.then(res => console.log(JSON.stringify(res, null, " ")))
	// .catch(err => console.log('DC promise rejected: \n' + err));
};

let doWriting = (path, fileContents) => {
//	fs.appendFile(path, fileContents, 'utf8', (err) => {
	return new Promise( (resolve, reject) => {
		fs.writeFile(path, fileContents, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data);
			// if (err) throw err; 
			// console.log("Write / overwrite successful!"); 	
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

let trimMeDown = (res) => {
	// console.log(res);
	const newRes = res.map( (element) => {
		const { commit: {author, message, url, sha} } = element; // my first destructuring
		return {
			author: author,
			message: message,
			url: url,
			sha: sha
		};
	});
	// console.log(newRes);
	return _objectify(newRes);
};

//option2: using callbacks
/*let getRepoCommits = (params, callback) => {
	github.repos.getCommits(params, callback);
};
*/

module.exports = {
	authenticate: authenticate,
	getRepoCommits: getRepoCommits,
	trimMeDown: trimMeDown,
	doWriting: doWriting
};
