const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./modules/github_wrapper')
let commitFeed = require('./data/commits.json');
const scrubData = require('./modules/scrubData');

const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        renderHTML(res);
    }

    else if (url.parse(req.url).pathname === '/commits') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        getCommits(getUserAndRepo(req, res));
        res.end();
    }
    else{
        res.statusCode = 200;
        res.end(`You made a ${req.method} request`);
    }
});


//read the html file into res.write and insert the appropriate JSON commit by replacing {{commitFeed}} in the html file
let renderHTML = (res) => {
    let commitFeedString = JSON.stringify(commitFeed, null, 2) || "";

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{commitFeed}}', commitFeedString);
        res.write(data);
        res.end();
    });
}

//return the user and repo info when form in submitted
let getUserAndRepo = (req, res) => {
    let path = url.parse(req.url).path;
    let user = /user=([^&|?|///|]*)/.exec(path);
    let repo = /repo=([^&|?|///|]*)/.exec(path);
    return { 'user': user[1], 'repo': repo[1] };
}

//call the github API and retrieve the data with the passed in user and repo name.
let getCommits = (formData) => {
    let commitFeedString = JSON.stringify(commitFeed, null, 2);
    github.init();
    github.authenticate();
    github.getCommits(formData.user, formData.repo, (err, res) => {
        if (err) throw err;
        scrubData.formatData(res.data, commitFeedString); //Formate (scrub the data) to output only the necessary information and save to commits.json
    
    });
}

server.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
})