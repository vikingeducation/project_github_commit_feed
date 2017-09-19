const http = require("http");

const routes = require("./modules/routes");

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var server = http.createServer((req, res) => {
	postOrGet(req, res);
});

server.listen(port, host, () => {
	console.log(`Listening: http://${host}:${port}`);
});

function postOrGet(req, res) {
	if (req.method == "POST") {
		routes.handleWebhooks(req, res);
	} else {
		routes.handleHtml(req, res);
	}
}
