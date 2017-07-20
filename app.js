const http = require("http");
const parseURL = require("./lib/parse_url");
const github = require("./github_wrappers");
const qs = require("qs");
const fs = require("fs");
const writeData = require("./data_writing");

const server = http.createServer((req, res) => {
	checkMethod(req, res);
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});


let serveWebpage = function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	fs.readFile("./public/index.html", "utf8", function(err, htmldata) {
		if (err) throw err;

		//console.log(req.url);
		var p = github(parseURL(req.url));
		//console.log(htmldata);

		p.then(function(jsondata) {
			writeData(htmldata, jsondata, res);
		}, function(reject) {
			console.log(reject);
			res.end(htmldata);
		});
	});
}


function checkMethod(req, res) {
	console.log("checking");
	if(req.method.toLowerCase() === "post") {
		console.log("post");
		listenWebHook(req,res);
	}
	console.log("get");
	serveWebpage(req, res);
}

function listenWebHook(req, res) {
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

    body = body.slice(8);

    body = qs.parse(body);

    var webHookData = {
    	username: body.pusher.name,
    	repo: body.repository.name
    }

    var dataPromise = github(webHookData);
  });
}
