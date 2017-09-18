const http = require("http");
const fs = require("fs");
const url = require("url");
const commitsDataFile = require("./data/commits");
const api = require("./apiWrapper");

const indexHtml = "./public/index.html";
const jsonCommitsFile = "./data/commits.json";
const urlRegex = /\/commits\?user=[a-z]/gi;

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var server = http.createServer((req, res) => {
	handle(req, res);
});

function handle(req, res) {
	var reqUrl = req.url;
	var urlMatchesFormSubmit = urlRegex.test(req.url);
	var urlParsedObj = url.parse(reqUrl, true).query;

	console.log("urlMatchesFormSubmit " + urlMatchesFormSubmit);
	console.log("req.url " + req.url);
	console.log("req.method " + req.method);
	console.log("");

	if (urlMatchesFormSubmit) {
		api
			.returnCommits(urlParsedObj.user, urlParsedObj.repo)
			.then(fullData => {
				var scrubbedData = scrubTheData(fullData);
				return writeFile(jsonCommitsFile, scrubbedData);
			})
			.then(() => {
				return readTheFile(jsonCommitsFile);
			})
			.then(jsonCommitsData => {
				readAndResHtmlFile(req, res, jsonCommitsData);
			})
			.catch(error => {
				console.error(error);
			});
		//console.log(urlParsedObj);
	} else {
		var commitFeed = "enter a username and rep";
		readAndResHtmlFile(req, res, commitFeed);
	}
}

server.listen(port, host, () => {
	console.log(`Listening: http://${host}:${port}`);
});

//http://learnjsdata.com/iterate_data.html
function scrubTheData(fullData) {
	var scrubbedData = fullData.data.map(function(data, i) {
		return {
			index: i + 1,
			commit: data.commit.message,
			html_url: data.html_url,
			author: data.author.login,
			author_url: data.author.html_url,
			sha: data.sha
		};
	});
	return scrubbedData;
}

function readAndResHtmlFile(req, res, commitFeed) {
	readTheFile(indexHtml).then(data => {
		//var replacedData = JSON.stringify(commitsDataFile, null, 2);
		var _data = data;
		_data = _data.replace("{{ commitFeed }}", commitFeed);
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(_data);
	});
}

function readTheFile(path) {
	return new Promise(resolve => {
		fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			resolve(data);
		});
	});
}

function writeFile(path, scrubbedData) {
	var jsonData = JSON.stringify(scrubbedData, null, 2);
	return new Promise(resolve => {
		fs.writeFile(path, jsonData, "utf8", err => {
			if (err) throw err;
			resolve();
		});
	});
}
