const url = require('url');
const fs = require('fs');
const commits = require('../data/commits.json');
const github = require('./githubAPI.js');



function parseReqData(req) {
  return new Promise((resolve, reject) => {
    let bodyStr = '';
    let bodyObj = {};

    req.on('data', (data) => {
      bodyStr += data;
    });

    req.on('end', () => {
      const keyValArr = bodyStr.split('&');

      keyValArr.forEach((el, idx) => {
        let subArr = el.split('=');
        let key = subArr[0];
        let val = subArr[1];

        bodyObj[key] = val;
      });

      req.body = bodyObj;
      resolve(req);
    });
  })
}

function writeToCommitsFile(commitsArr, username) {
  const path = './data/commits.json';
  const newCommits = commits;

  if (newCommits) {
    newCommits[username] = commitsArr;

    fs.writeFile(path, JSON.stringify(newCommits, null, 2), (err) => {
      if (err) {
        throw err;
      }

      console.log('Added new user commits to commits');
    });
  } else {
    fs.writeFile(path, JSON.stringify(commitsArr, null, 2), (err) => {
      if (err) {
        throw err;
      }

      console.log('Wrote to path!');
    });
  }
}


const router = {
  routes: {
    'get': {
      '/': (req, res) => {
        fs.readFile('./public/index.html', (err, data) => {
          if (err) {
            res.statusCode = 404;
            res.end('Not Found.');
          }

          data = data.toString();
          const commitsStr = JSON.stringify(commits, null, 2);
          data = data.replace('{{ commitFeed }}', commitsStr);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(data);
        });
      }
    },
    'post': {
      '/commits': (req, res) => {
        parseReqData(req)
          .then((newReq) => {
            const { userName, repoName } = newReq.body;
            github.getCommits(userName, repoName)
              .then((commits) => {
                commitsArr = commits.data;

                const filteredCommits = commitsArr.map((commit) => {
                  return {
                    sha: commit.sha,
                    message: commit.commit.message,
                    url: commit.html_url,
                    author: commit.author,
                  }
                });

                writeToCommitsFile(filteredCommits, userName);
              })
              .catch((err) => {
                console.error(err);
              })
          })
          .catch((err) => {
            console.error(err);
          })
      },
      '/github/webhooks': (req, res) => {
        var _headers = {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
        };

        let strData = '';

        req.on('data', (data) => {
          strData += data.toString();
        });

        req.on('end', () => {
          let webhookData = JSON.parse(strData);
          console.log(webhookData);

          const userName = webhookData.pusher.name;
          const repoName = webhookData.repository.name;

          github.getCommits(userName, repoName)
            .then((commits) => {
              commitsArr = commits.data;

              const filteredCommits = commitsArr.map((commit) => {
                return {
                  sha: commit.sha,
                  message: commit.commit.message,
                  url: commit.html_url,
                  author: commit.author,
                }
              });

              writeToCommitsFile(filteredCommits, userName);

              // res.writeHead(200, _headers);
              // res.end('200 OK');
            })
            .catch((err) => {
              console.error(err);
            })
        });
      },
    }
  }
};


router.handleReq = (req, res) => {
  const method = req.method.toLowerCase();
  const path = url.parse(req.url).pathname;

  if (router.routes[method][path]) {
    router.routes[method][path](req, res);
  } else {
    res.end('404 Not Found');
  }
};



module.exports = router;
