const http = require("http");
const parseURL = require("./lib/parse_url");
const github = require("./github_wrappers");
const writeData = require("./data_writing");
const htmlRead = require("./html_reading");

const server = http.createServer((req, res) => {
	checkMethod(req, res);
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});

function checkMethod(req, res) {
	console.log("checking");
	if(req.method.toLowerCase() === "post") {
		console.log("post");
		listenWebHook(req,res);
	}
	console.log("get");
	serveWebpage(req, res);
}


function serveWebpage(req, res) {
	res.setHeader('Content-Type', 'text/html');

	htmlRead()
	.then((htmldata) => {
		console.log(parseURL(req.url));
		let p = github.getGithubCommits(parseURL(req.url));

	p.then((jsondata) => {
			jsondata = JSON.stringify(jsondata, null, 2);
			captured = htmldata.split("<pre>");
			capturedData = captured[1].split("</pre>");
			htmldata = htmldata.replace(capturedData[0], jsondata);
			res.end(htmldata);
		}, function(reject) {
			var defaultData = require("./data/commits.json");
			defaultData = JSON.stringify(defaultData, null, 2)
			captured = htmldata.split("<pre>");
			capturedData = captured[1].split("</pre>");
			htmldata = htmldata.replace(capturedData[0], defaultData);
			res.end(htmldata);
		});
	});
}




function listenWebHook(req, res) {
	console.log("POSTING DATA");
  var body = ""

  req.on("data", function(data) {
    body += data;
  });

  req.on("end", function() {
  	var _headers = {
	    "Content-Type": "text/html",
	    "Access-Control-Allow-Origin": "*",
	    "Access-Control-Allow-Headers": "Content-Type",
	    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
	  };

	  res.writeHead(200, _headers);

		body = decodeURIComponent(body);
		body = JSON.parse(body.slice(8));


    var webHookData = {
    	username: body.pusher.name,
    	repo: body.repository.name
    }
		console.log(webHookData);

    res.end("200 OK");

    htmlRead().then((htmldata) => {
    	dataPromise = github(webHookData);

			console.log("writing data");

			dataPromise.then(function(jsondata) {
				writeData(htmldata, jsondata, res);
			}, function(reject) {
				console.log(reject);
				res.end(htmldata);
			});
    });
  });
}
