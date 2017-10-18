'use strict';

const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer( (req, res) => {
	fs.readFile(__dirname + '/public/index.html', 'utf8', (err,data) => {
		if (err) {
			//response.writeHead(statusCode[, statusMessage][, headers])
			//writeHead() sends a **response header** to the request.
			res.writeHead(404);
			res.end("404 Not Found");
		} else {
			//response.writeHead(statusCode[, statusMessage][, headers])
			res.writeHead(200, {
				"Content-Type": "text/html"
			});
			res.end(data);
		}
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
