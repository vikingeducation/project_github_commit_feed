const http = require('http');
const fs = require('fs');
const url = require('url');

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
                    res.write(html);
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

module.exports = Router;