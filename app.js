'use strict';

const http = require('http');
const fs = require('fs');

const myJsonFile = require('./data/commits.json');
const myStrFile = JSON.stringify(myJsonFile, null, 2);

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
			let goodToGo = data.replace('{{ commitFeed }}', myStrFile);
			res.end(goodToGo);
		}
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
