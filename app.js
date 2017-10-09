const http = require('http');
const fs = require('fs');
const url = require('url');

const github = require('./modules/github')
github.authenticate()

const host = "localhost";
const port = 3000;

var commitsJSON = require('./data/commits.json')
var commits = JSON.stringify(commitsJSON, null, 2)

var currentCommits = commits;

var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

const server = http.createServer((req, res) => {
  console.log("/req.url", req.url)
// WEBHOOKS!!!
  if (req.url === '/github/webhooks') {
    console.log("its reached to the endpoint github webhooks enpoint")
    var buffer = '';
    req.on("data", data => {
      buffer += data.toString()
    })
    req.on("end", () => {
      buffer = decodeURIComponent(buffer)
      data = JSON.parse(buffer.slice(8))
      console.log(data)
      var name = data.pusher.name
      var repo = data.repository.name;
      //TODO: Figure out the way to not repeat the the getcommits code
      github.getCommits(name, repo).then( gitcommits =>{
        gitcommits = gitcommits.data.map(gitcommit => {
          return {
            'message': gitcommit.commit.message,
            'author': gitcommit.commit.author.name,
            'url': gitcommit.html_url,
            'sha': gitcommit.sha
          }
        })
        gitcommits = JSON.stringify(gitcommits, null, 2)
        fs.writeFileSync('./data/commits.json', gitcommits);
        res.writeHead(200, _headers);
        data = data.toString().replace(currentCommits, gitcommits);
        currentCommits = gitcommits
        res.end(data)
      })
    })

    res.writeHead(200, _headers);
    res.end("200 ok")

  }

//NORMAL FUNCTIONALITY
  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 not found');
      }
      res.writeHead(200, _headers);
      if (url.parse(req.url).pathname === '/commits'){
        let formData = url.parse(req.url, true).query
        github.getCommits(formData.username, formData.repo).then( gitcommits =>{
          gitcommits = gitcommits.data.map(gitcommit => {
            return {
              'message': gitcommit.commit.message,
              'author': gitcommit.commit.author.name,
              'url': gitcommit.html_url,
              'sha': gitcommit.sha
            }
          })
          gitcommits = JSON.stringify(gitcommits, null, 2)
          fs.writeFileSync('./data/commits.json', gitcommits);
          res.writeHead(200, _headers);
          data = data.toString().replace(currentCommits, gitcommits);
          currentCommits = gitcommits
          res.end(data)
        })
        // console.log("params", formData);
        // var gitmod = require('./index.js')(formData['username'], formData['repo'])
        // console.log("github", gitmod)
        // let data = github.getData
        // console.log(data)
      }
      // console.log(url.parse(req.url, true))
      if (data.toString().search('{{ commitFeed }}') > -1){
        console.log("{{ commitFeed }} is found!")
        data = data.toString().replace( '{{ commitFeed }}', currentCommits)
        res.end(data);
      } else {
        console.log("{{cmmtFeed}} is not found");
      }

    });
  });

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
