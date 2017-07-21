const fs = require("fs");

// changing the data commits file and the html file simultaneously
// break functionality into 2
module.exports = function(htmldata, jsondata, res) {
	fs.appendFile("./data/commits.json", JSON.stringify(jsondata, null, 2), 'utf8', (err) => {
		if(err) throw err;
		let dataJSON = require("./data/commits");
		dataJSON = JSON.stringify(dataJSON, null, 2);
		htmldata = htmldata.replace("{{ commitFeed }}", dataJSON);
		res.end(htmldata);
	});
}
