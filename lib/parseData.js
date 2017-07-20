function parseData(data) {
  return data.map(commit => {
    var result = {};
    result.sha = commit.sha;
    result.author = commit.commit.author.name;
    result.email = commit.commit.author.email;
    result.date = commit.commit.author.date;
    result.url = commit.url;
    result.message = commit.commit.message;
    return result;
  });
}

module.exports = parseData;
