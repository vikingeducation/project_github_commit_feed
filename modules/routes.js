const url = require("url");
const commitsDataFile = require("../data/commits");
const api = require("./apiWrapper");
const fsOperation = require("./fs_promises");
const scrubTheData = require("./scrubthedata");
const indexHtml = "./public/index.html";
const jsonCommitsFile = "./data/commits.json";

const urlRegex = /^\/commits\?.+/i;

const routes = {};

routes.handleHtml = function(req, res) {
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
};

routes.handleWebhooks = function(req, res) {
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

		body = decodeURIComponent(body);
		body = JSON.parse(body.slice(8));

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
};

function readAndResHtmlFile(req, res, commitFeed) {
	fsOperation.readTheFile(indexHtml).then(data => {
		//var replacedData = JSON.stringify(commitsDataFile, null, 2);
		var _data = data;
		_data = _data.replace("{{ commitFeed }}", commitFeed);
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(_data);
		//console.log(_data);
		console.log(req.url);
	});
}

module.exports = routes;
