const http = require("http");
const parseURL = require("./lib/parse_url");
const github = require("./github_wrappers");
const qs = require("qs");

const writeData = require("./data_writing");
const htmlRead = require("./html_reading");

const server = http.createServer((req, res) => {
	checkMethod(req, res);
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});


let serveWebpage = function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	htmlRead()
	.then((htmldata) => {
		var p = github(parseURL(req.url));
	p.then((jsondata) => {
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


		body = body.replace("payload=", "?");

    //console.log(parseURL(body));
		console.log(qs.parse(body));
		body = qs.parse(body);
		console.log(req.headers);


    var webHookData = {
    	username: body.pusher.name,
    	repo: body.repository.name
    }

    htmlRead().then((htmldata) => {
    	dataPromise = github(webHookData);

			dataPromise.then(function(jsondata) {
				writeData(htmldata, jsondata, res);
			}, function(reject) {
				console.log(reject);
				res.end(htmldata);
			});
    });

  });
}
