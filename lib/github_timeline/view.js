const fs = require('fs');
const url = require('url');
const Handlebars = require('handlebars/runtime');
const github = require('../github');


function _respondWithApi(query, res) {
  let commitPromise = github(query.repo, query.username);

  commitPromise
    .then(commits => {
      _hbTemplate({ commits: commits }, res, 200);
    })
    .catch(err => {
      console.error(`API Error: ${err.message}`);
      _hbTemplate({ error: 'API request failed' }, res, 500);
    });
}

// function _writeTemplate(template, insertValue, res, code) {
//   let pageContents = template.toString().replace('{{commits}}', insertValue);

//   res.statusCode = code;
//   res.end(pageContents, 'text/html');
// }

function _hbTemplate(data, res, code) {
  fs.readFile('./public/index.hbs', (err, htmlTemplate) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error! Template file not found!', 'text/html');
        
      console.error(`Failed to load template: ${err.message}`);
    } else {
      let template = Handlebars.compile(htmlTemplate);
      let renderedPage = template(data);

      res.statusCode = code;
      res.end(renderedPage, 'text/html');
    }
  });
}

function handleHomePage(req, res) {
   
  let query = url.parse(req.url, true).query;

  if (Object.keys(query).length) {
    _respondWithApi(query, res, 200);
  } else {
    _hbTemplate(null, res, 200);
  }
    
}

module.exports = handleHomePage;
