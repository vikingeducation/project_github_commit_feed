const token = require("./apikey");
const http = require("http");
const fs = require("fs");
const commitsData = require("./data/commits");
const url = require("url");

const indexHtml = "./public/index.html";
const urlRegex = /\/commits\?/;

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var server = http.createServer((req, res) => {
	var reqUrl = req.url;
	var urlMatchesFormSubmit = urlRegex.test(req.url);
	var urlParsed = url.parse(reqUrl, true).query;

	console.log("urlMatchesFormSubmit " + urlMatchesFormSubmit);
	console.log("req.url " + req.url);
	console.log("req.method " + req.method);
	console.log("url.pathname" + url.pathname);

	if (req.method == "POST") {
		postParser(req, res);
	}

	if (urlMatchesFormSubmit) {
		console.log("found a match");
		readAndResHtmlFile(req, res);
		console.log(urlParsed);
		console.log("url.pathname " + url.pathname);
	} else {
		readAndResHtmlFile(req, res);
	}
});

server.listen(port, host, () => {
	console.log(`Listening: http://${host}:${port}`);
});

function postParser(req, res) {
	//body data += lalala
	console.log(req, "req");
	console.log(res, "res");
}

function readAndResHtmlFile(req, res) {
	readHtmlFile(indexHtml).then(data => {
		var replacedData = JSON.stringify(commitsData, null, 2);
		var dataReplacer = data;
		dataReplacer = data.replace("{{ commitFeed }}", replacedData);
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(dataReplacer);
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
