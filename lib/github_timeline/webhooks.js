const github = require('../github');
const fs = require('fs');

function handleWebHooks(req, res) {
  let _headers = {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
  };

  res.writeHead(200, _headers);

  let trimmed = decodeURIComponent(req.body).slice(8);
  let decoded = JSON.parse(trimmed);

  let user = decoded.repository.owner.login;
  let repo = decoded.repository.name;

  responsePromise = github(repo, user);

  responsePromise
    .then(commits => {
      fs.writeFile(
        './data/commits.json',
        JSON.stringify(commits, null, 2),
        err => {
          if (err) {
            console.error('Error: Failed to write commit file.');
            console.error(err.message);
          }
        }
      );
    })
    .catch(err => {
      console.error(`API Error: ${err.message}`);
    });
}

module.exports = handleWebHooks;
