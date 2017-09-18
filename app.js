const http = require("http");
const fs = require("fs");
const url = require("url");
const commitsDataFile = require("./data/commits");
const api = require("./apiWrapper");

const indexHtml = "./public/index.html";
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
	console.log("url.pathname" + url.pathname);

	if (urlMatchesFormSubmit) {
		var commitFeed = JSON.stringify(commitsDataFile, null, 2);
		readAndResHtmlFile(req, res, commitFeed);
		console.log("found a match");
		console.log(urlParsedObj);
		api.returnCommits(urlParsedObj.user, urlParsedObj.repo).then(res => {
			console.log(res);
		});
	} else {
		var commitFeed = "enter a username and rep";
		readAndResHtmlFile(req, res, commitFeed);
	}
}

server.listen(port, host, () => {
	console.log(`Listening: http://${host}:${port}`);
});
/*
function postParser(req, res) {
	//body data += lalala
	console.log(req, "req");
	console.log(res, "res");
}
*/
function readAndResHtmlFile(req, res, commitFeed) {
	readHtmlFile(indexHtml).then(data => {
		//var replacedData = JSON.stringify(commitsDataFile, null, 2);
		var _data = data;
		_data = _data.replace("{{ commitFeed }}", commitFeed);
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(_data);
	});
}

function readHtmlFile(path) {
	return new Promise(resolve => {
		fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			resolve(data);
		});
	});
}
