const fs = require('fs');
const url = require('url');
const github = require('../github');

function _respondWithApi(htmlTemplate, query, res) {
  let commitPromise = github(query.repo, query.username);

  commitPromise
    .then(commits => {
      commits = JSON.stringify(commits, null, 2);
      _writeTemplate(htmlTemplate, commits, res, 200);
    })
    .catch(err => {
      console.error(`API Error: ${err.message}`);
      _writeTemplate(htmlTemplate, 'API Request Failed', res, 500);
    });
}

function _writeTemplate(template, insertValue, res, code) {
  console.log('here');
  let pageContents = template.toString().replace('{{commits}}', insertValue);

  res.statusCode = code;
  res.setHeader('Content-Type', 'text/html');
  res.end(pageContents);
}

function handleHomePage(req, res) {
  fs.readFile('./public/index.html', (err, htmlTemplate) => {
    if (err) {
      _writeTemplate(
        ['{{commits}}'],
        'Error! Template file not found!',
        res,
        500
      );
      console.error(`Failed to load template: ${err.message}`);
    } else {
      let query = url.parse(req.url, true).query;

      if (Object.keys(query).length) {
        _respondWithApi(htmlTemplate, query, res, 200);
      } else {
        _writeTemplate(htmlTemplate, '', res, 200);
      }
    }
  });
}

module.exports = handleHomePage;
