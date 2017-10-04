const GitHubApi = require("github");
const GITHUB_API_KEY = require('./config.json').token;
const fs = require('fs');
let feed = require('./data/commits');

let wrapper = {};

wrapper.init = () => {
	let github = new GitHubApi();
	return github;
};

wrapper.authenticate = (github) => {
	github.authenticate({
    type: "token",
    token: GITHUB_API_KEY
  });
};

wrapper.getCommits = (github, username, repo) => {
	github.repos.getCommits({
  	owner: username, 
  	repo: repo
	}, function(err, res) {
  	if (err) console.log(err);
  	else scrubData(res.data);
	});
};

scrubData = (commits) => {

  let results = commits.map((each) => {
    let scrubbed = {}; 
    scrubbed.message = each.commit.message;
    scrubbed.author = each.commit.author;
    scrubbed.url = each.html_url;
    scrubbed.sha = each.sha;
    return scrubbed;
  });

  if (feed.commits) {
    results.forEach((element) => {
      // check if record (by sha) already exists 
      feed.commits.push(element);
    });

  } else {
    feed.commits = results;

  }

  fs.writeFileSync('./data/commits.json', JSON.stringify(feed, null, 2), (err) => {
    if (err) throw err;
    console.log("saved commits appended successfully");
  });
}

module.exports = wrapper;
