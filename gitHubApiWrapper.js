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
  	if (err) throw err;  //handle error
  	else refreshHTML(res, scrubData(response.data));
	});
};


///////////////////////////////////////////////////////////////////

function scrubData(commits) {

  let results = commits.map((each) => {

    let scrubbed = {}; 
    scrubbed.message = each.commit.message;
    scrubbed.author = each.commit.author;
    scrubbed.url = each.html_url;
    scrubbed.sha = each.sha;

    return scrubbed;

  });

  let savedCommits = checkSaved(results);

  fs.writeFileSync('./data/commits.json', JSON.stringify(savedCommits, null, 2), (err) => {
    if (err) throw err;
    console.log("saved commits appended successfully");
  });

  return savedCommits;
}

function checkSaved(commits) {
  commits.forEach((element) => {
    let name = element.author.name;

    if (savedFeed[name]) {
      let noMatch = true;

      savedFeed[name].forEach((each) => {
        if (each.sha === element.sha) {
          noMatch = false;
        }
      });

      if (noMatch) {
        savedFeed[name].unshift(element);
      }
    } else {
      savedFeed[name] = [element];
    }
  });

  return savedFeed;
}


function refreshHTML(res, feed) {
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) throw err;
      data = data.replace('{{ commitFeed }}', JSON.stringify(feed, null, 2));
      res.write(data);
  });
}

module.exports = wrapper;
