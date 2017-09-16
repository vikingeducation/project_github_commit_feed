const token = require("./apikey");
const http = require("http");
const fs = require("fs");

const indexHtml = "./public/index.html";

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var server = http.createServer((req, res) => {
	console.log("req made " + req.url);
	if (req.method == "POST") {
		postParser(req, res);
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
		res.writeHead(200, { "content-Type": "text/html" });
		res.end(data);
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
