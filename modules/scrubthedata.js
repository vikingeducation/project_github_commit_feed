//http://learnjsdata.com/iterate_data.html
module.exports = function scrubTheData(fullData) {
	var scrubbedData = fullData.data.map(function(data, i) {
		return {
			index: i + 1,
			commit: data.commit.message,
			html_url: data.html_url,
			author: data.author.login,
			author_url: data.author.html_url,
			sha: data.sha
		};
	});
	return scrubbedData;
};
