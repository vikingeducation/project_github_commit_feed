function parseData(data) {
  return data.map(commit => {
    return {
	    sha: commit.sha,
	    author: commit.commit.author.name,
	    email: commit.commit.author.email,
	    date: commit.commit.author.date,
	    url: commit.url,
	    message: commit.commit.message
		}
  });
}

module.exports = parseData;
