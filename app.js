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

  if (url.parse(req.url,true).pathname === '/github/webhooks') {
    console.log("its reached to the endpoint github webhooks enpoint")
    console.log("req.data", req.data)
    var buffer = '';
    req.on("data", (data) => {
      console.log("i am in the req.on data")
      console.log(JSON.parse(decodeURI(data).slice(8)));
      buffer += JSON.parse(decodeURI(data).slice(8));
      // data = JSON.parse(data);
      // name = data.pusher.name;
      // repo = data.repository.name;
    })
    console.log(buffer)

    res.writeHead(200, _headers);
    res.end("200 ok")

  }


  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 not found');
      }
      res.writeHead(200, _headers);



      if (url.parse(req.url).pathname === '/commits'){
        let formData = url.parse(req.url, true).query
        github.getCommits(formData.username, formData.repo).then( gitcommits =>{
          gitcommits = gitcommits.data.map(Json => {
            return {
              'message': Json.commit.message,
              'author': Json.commit.author.name,
              'url': Json.html_url,
              'sha': Json.sha
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
