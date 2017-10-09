const http = require('http');
const fs = require('fs');
const url = require('url');

const github = require('./modules/github')
github.authenticate()

const host = "localhost";
const port = 3000;

const commitsJSON = require('./data/commits.json')
var commits = JSON.stringify(commitsJSON, null, 2)

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
        github.getCommits(formData.username, formData.repo).then((commits)=>{
          console.log(commits.data)
        })
        // console.log("params", formData);
        // var gitmod = require('./index.js')(formData['username'], formData['repo'])
        // console.log("github", gitmod)
        // let data = github.getData
        // console.log(data)
      }
      // console.log(url.parse(req.url, true))
      data = data.toString().replace( '{{ commitFeed }}', commits)
      res.end(data);
    });
  });

server.listen(port, host, () => {
  console.log("server running at localhost:3000")
})
