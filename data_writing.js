const fs = require("fs");

module.exports = function(err, result) {
	fs.writeFile("./data/commits.json", JSON.stringify(result), 'utf8', (err) => {
		let dataJSON = require("./data/commits");
		dataJSON = JSON.stringify(dataJSON, null, 2);
		data = data.replace("{{ commitFeed }}", dataJSON);
		res.end(data);
	});
}