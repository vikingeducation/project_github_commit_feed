const http = require('http');
const fs = require('fs');
const url = require('url');
var commitFile = require('./data/commits');
const GithubApi = require('./lib/github_api_wrapper');
require('dotenv').config();

var github = GithubApi();
github.authenticate(process.env.GITHUB_TOKEN);

const port = 3000;
const host = 'localhost';

var server = http.createServer((req, res) => {

  var params = url.parse(req.url, true).query;

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      var webhookPromise = new Promise((resolve, reject) => {
        if (req.url === '/github/webhooks') { // respond to webhook
          req.body = '';

          req.on('data', (data) => {
            req.body += data;
          });

          req.on('end', () => {
            body = JSON.parse(req.body);
            var owner = body.repository.owner.login;
            var repo = body.repository.name;
            console.log(`Recieved webhook push data from repository - Owner: ${ owner }, Repo Name: ${ repo } `);
            params = { owner: owner, repo: repo };
            resolve(params);
          });
        } else {
          resolve();
        }
      });

      webhookPromise.then(() => {
        var _headers = {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
        };

        res.writeHead(200, _headers);

        console.log(params);

        // if there are params
        if (Object.keys(params).length !== 0) {
          github.getCommits(params)

          .then((commits) => {
            // Scrub the commit data
            commits = commits.map((obj) => {
              return {
                'message': obj.commit.message,
                'author': obj.commit.author,
                'url': obj.html_url,
                'sha': obj.sha
               };
            });

            // Add repo name to object for identification
            var displayCommits = {};
            displayCommits[params.repo] = commits;
            commits = JSON.stringify(displayCommits, null, 2);

            if (Object.keys(commitFile).length === 0) {
              // Overwrite
              fs.writeFileSync('./data/commits.json', commits);
            } else {
              // Get original file
              var original = fs.readFileSync('./data/commits.json', 'utf8', 'r');

              // Remove unnecessary curly braces
              original = original.substr(0, original.length - 2);
              commits = original + ',\n\n\n' + commits.substr(1, commits.length);

              // Rewrite file
              fs.writeFileSync('./data/commits.json', commits);
            }

            // reload the contents as JSON
            commitFile = fs.readFileSync('./data/commits.json', 'utf8', 'r');

            // Replace the feed
            data = data.replace('{{ commitFeed }}', commitFile);

            res.end(data);
          })

          .catch((err) => {
            // Give red error message
            data = data.replace('{{ commitFeed }}', `<p class="text-center" style="color:red;">${ JSON.parse(err.body).message }</p>`);
            res.end(data);
          });
        } else { // No params
          // If the commit file is empty
          if (Object.keys(commitFile).length === 0) {
            // Prompt user to fill out form
            data = data.replace('{{ commitFeed }}', '<p class="text-center">Enter a Username and Repo in the form to view the commit feed.</p>');
          } else {
            // Place already saved data in the commit JSON file
            var commitFeed = JSON.stringify(commitFile, null, 2);
            data = data.replace('{{ commitFeed }}', commitFeed);
          }
          res.end(data);
        }
      });
    }
  });
});

server.listen(port, host, () => {
  console.log(`Listening at http:// ${ host }:${ port }`);
});
