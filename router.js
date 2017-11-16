const http = require('http');
const fs = require('fs');
const url = require('url');
const data1 = require('./data/commits.json');
const Router = {};


Router.handle = (req, res) => {
    let method = req.method.toLowerCase();
    let path = url.parse(req.url).pathname;
    Router.routes[method][path](req, res);
};

Router.routes = {
    get: {
        '/': (req, res) => {
            fs.readFile('./views/index.html', function (err, html) {
                if (err) {
                    throw err;
                }
                   res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                 
                    data = JSON.stringify(data1, null, 2);
                  

                    res.write(html.toString().replace(/{{commitfeed}}/,data))
                    res.end();
                })
            }
        },
    post: {
        '/': (req, res) => {
            fs.readFile('./views/index.html', function (err, html) {
                if (err) {
                    throw err;
                }
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    res.write(html);
                    res.end();
                })
            }
        },
};
    

 

  // Output the POST data



module.exports = Router;