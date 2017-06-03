let http = require('http');
let fs = require('fs');


let port = process.env.PORT || process.argv[2] || 3000;
let host = "localhost";

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        fs.createReadStream('./public/index.html').pipe(res);

    }
    else{
        res.statusCode = 404;
        res.end('not found');
    }
});


server.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
})