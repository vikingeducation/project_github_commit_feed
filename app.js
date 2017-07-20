const http = require("http");
const fs = require("fs");
var commitFeed = require("./data/commits");

commitFeed = JSON.stringify(commitFeed, null, 2);

const server = http.createServer(function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	fs.readFile("./public/index.html", "utf8", function(err, data) {
		if (err) throw err;

		data.replace("{{ commitFeed }}", commitFeed);
		res.end(data);
	});
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});