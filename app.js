const http = require("http");
const fs = require("fs");
const parseURL = require("./lib/parse_url");
const github = require("./github_wrappers");
const qs = require("qs");

const server = http.createServer((req, res) => {
	checkMethod(req, res);
});


function checkMethod(req, res) {
	if(req.method.toLowerCase() === "post") {
		listenWebHook(req,res);
	}
	serveWebpage(req, res);
}

let serveWebpage = function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	fs.readFile("./public/index.html", "utf8", function(err, data) {
		if (err) throw err;

		//console.log(req.url);
		var p = github(parseURL(req.url));

		p.then(function(result) {

		}, function(reject) {
			console.log(reject);
			res.end(data);
		});
	});
}


server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});

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
    console.log(body);
  });
}
