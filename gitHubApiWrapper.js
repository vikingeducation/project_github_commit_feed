const GitHub = require("github");
const GITHUB_API_KEY = require('./config.json').token;
const fs = require('fs');
let savedFeed = require('./data/commits');

let wrapper = {};
let github;

wrapper.init = () => {
	github = new GitHub();
};

wrapper.authenticate = () => {
	github.authenticate({
    type: "token",
    token: GITHUB_API_KEY
  });
};

wrapper.getCommits = (username, repo, res) => {
	github.repos.getCommits({
  	owner: username, 
  	repo: repo
	}, function(err, response) {
  	if (err) console.log(err);
  	else renderHTML(res, scrubData(response.data));
	});
};

function scrubData(commits) {

  let results = commits.map((each) => {

    let scrubbed = {}; 
    scrubbed.message = each.commit.message;
    scrubbed.author = each.commit.author;
    scrubbed.url = each.html_url;
    scrubbed.sha = each.sha;

    return scrubbed;

  });

  if (savedFeed.commits) {
    // if existing saved feed, push new feed
    results.forEach((element) => {
      savedFeed.commits.push(element);
    });

  } else {
    // if empty, just assign new feed to saved feed
    savedFeed.commits = results;
  }

  fs.writeFileSync('./data/commits.json', JSON.stringify(savedFeed, null, 2), (err) => {
    if (err) throw err;
    console.log("saved commits appended successfully");
  });

  return savedFeed;
}

function renderHTML(res, feed) {
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) throw err;
      data = data.replace('{{ commitFeed }}', JSON.stringify(feed, null, 2));
      res.write(data);
  });
}

module.exports = wrapper;
