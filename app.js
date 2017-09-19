const http = require("http");
const url = require("url");
const commitsDataFile = require("./data/commits");
const api = require("./modules/apiWrapper");
const fsOperation = require("./modules/fs_promises");

const indexHtml = "./public/index.html";
const jsonCommitsFile = "./data/commits.json";
const urlRegex = /\/commits\?user=[a-z]/gi;

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var server = http.createServer((req, res) => {
	postOrGet(req, res);
});

server.listen(port, host, () => {
	console.log(`Listening: http://${host}:${port}`);
});

function postOrGet(req, res) {
	if (req.method == "POST") {
		handleWebhooks(req, res);
	} else {
		handleHtml(req, res);
	}
}

function handleHtml(req, res) {
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
				return fsOperation.writeTheFile(jsonCommitsFile, scrubbedData);
			})
			.then(() => {
				return fsOperation.readTheFile(jsonCommitsFile);
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

function handleWebhooks(req, res) {
	console.log(req.method);

	var body = "";
	req.on("data", data => {
		body += data;
	});

	req.on("end", () => {
		var _headers = {
			"Content-Type": "text/html",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
		};
		res.writeHead(200, _headers);
		try {
			body = decodeURIComponent(body);
			body = JSON.parse(body.slice(8));
		} catch (e) {
			console.error(e);
		}

		res.end("200 OK");

		var webhookData = {
			username: body.pusher.name,
			repository: body.repository.name
		};

		api
			.returnCommits(webhookData.username, webhookData.repository)
			.then(webhookData => {
				var scrubbedData = scrubTheData(webhookData);
				return fsOperation.writeTheFile(jsonCommitsFile, scrubbedData);
			})
			.then(() => {
				return fsOperation.readTheFile(jsonCommitsFile);
			})
			.then(jsonCommitsData => {
				readAndResHtmlFile(req, res, jsonCommitsData);
			})
			.catch(error => {
				console.error(error);
			});
	});
}

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
	fsOperation.readTheFile(indexHtml).then(data => {
		//var replacedData = JSON.stringify(commitsDataFile, null, 2);
		var _data = data;
		_data = _data.replace("{{ commitFeed }}", commitFeed);
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(_data);
	});
}
