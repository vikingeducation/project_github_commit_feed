const http = require("http");
const fs = require("fs");

const server = http.createServer(function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	fs.readFile("./public/index.html", "utf8", function(err, data) {
		if (err) throw err;
		res.end(data);
	});
});

server.listen(3000, "localhost", function() {
	console.log("Now listening...");
});