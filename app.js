const http = require("http");
const fs = require("fs");
const parseURL = require("./lib/parse_url");
const github = require("./github_wrappers");

const server = http.createServer(function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	fs.readFile("./public/index.html", "utf8", function(err, data) {
		if (err) throw err;



		//console.log(req.url);
		var p = github(parseURL(req.url));

		p.then(function(result) {

			fs.writeFile("./data/commits.json", JSON.stringify(result), 'utf8', (err) => {
				let dataJSON = require("./data/commits");
				dataJSON = JSON.stringify(dataJSON, null, 2);
				data = data.replace("{{ commitFeed }}", dataJSON);
				res.end(data);
			});
		}, function(reject) {
			console.log(reject);
			res.end(data);
		});
	});
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});


server2 = http.createServer(function (req, res) {
	var _headers = {
	  "Content-Type": "text/html",
	  "Access-Control-Allow-Origin": "*",
	  "Access-Control-Allow-Headers": "Content-Type",
	  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
	};

	res.writeHead(200, _headers);

	var body = ""

	req.on("data", function(data) {
		body =+ data;
	});

	req.on("end", function() {
		body = body.slice(8);

		body = JSON.parse(body);
		console.log(body);
	});
});

server2.listen("/github/webhooks", function() {
});