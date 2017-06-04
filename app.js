const http = require('http');
const fs = require('fs');
const url = require('url');
let commitFeed = require('./data/commits.json');


const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        renderHTML(res);
    }

    else if(url.parse(req.url).pathname === '/commits'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        getUserAndRepo(req,res);
    }
    else {
        res.statusCode = 404;
        res.end('not found');
    }
});


//read the html file into res.write and insert the appropriate JSON commit by replacing {{commitFeed}} in the html file
let renderHTML = (res) => {
    let commitFeedString = JSON.stringify(commitFeed, null, 2);

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{commitFeed}}', commitFeedString);
        res.write(data);
        res.end();
    });
}

let getUserAndRepo = (req,res) => {
    let path = url.parse(req.url).path;
    let user = /user=([^&|?|///|]*)/.exec(path);
    let repo = /repo=([^&|?|///|]*)/.exec(path);
    console.log(`Username is: ${user[1]}\nRepo is: ${repo[1]}`);
}

server.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
})