const url = require('url');
const fs = require('fs');
const commits = require('../data/commits.json');



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
            req = newReq;
            console.log(req.body);
          })
          .catch((err) => {
            console.error(err);
          })
      }
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
