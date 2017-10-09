const http = require('http');
const fs = require('fs');
const url = require('url');

const github = require('./modules/github')
github.authenticate()

const host = "localhost";
const port = 3000;

var commitsJSON = require('./data/commits.json')
var commits = JSON.stringify(commitsJSON, null, 2)

var currentCommits;

const server = http.createServer((req, res) => {

  fs.readFile('./public/index.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 not found');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

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
          var commitsJSON = require('./data/commits.json')
          var commits = JSON.stringify(commitsJSON, null, 2)
          data = data.toString().replace(currentcommits, commits);
          currentcommits = commmits
          console.log(data)
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
        data = data.toString().replace( '{{ commitFeed }}', commits)
        currentcommits = commits
        res.end(data);
      } else {
        data = data.toString().replace(currentcommits, gitcommits);
        currentcommits = gitcommits
        console.log(data)
        res.end(data)
      }

    });
  });

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
