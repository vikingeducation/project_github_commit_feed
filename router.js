const Router = {
	routes: {},
	params: {}
};

// Handle requests.
Router.handle = function handle(req, res) {
	console.log('**** Handling Request ****');

	const verb = req.method.toLowerCase();
	const path = _trimPath(req);

	// Get data.
	new Promise(resolve => {
		(verb !== 'get') ? _getData(req, resolve):resolve();
	}).then(result => {

	});
};

function _trimPath(req) {
	return url.parse(req.url).pathname.trim().replace(/^\/|\/$/g, "");
}

function _getData(req, done) {

}
