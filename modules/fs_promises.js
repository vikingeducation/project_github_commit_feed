const fs = require("fs");

function readTheFile(path) {
	return new Promise(resolve => {
		fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			resolve(data);
		});
	});
}

function writeTheFile(path, scrubbedData) {
	var jsonData = JSON.stringify(scrubbedData, null, 2);
	return new Promise(resolve => {
		fs.writeFile(path, jsonData, "utf8", err => {
			if (err) throw err;
			resolve();
		});
	});
}

module.exports = {
	readTheFile,
	writeTheFile
};
