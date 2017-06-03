let http = require('http');
let fs = require('fs');
let commitFeed = require('./data/commits.json');

let port = process.env.PORT || process.argv[2] || 3000;
let host = "localhost";

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        renderHTML(res);
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


server.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
})