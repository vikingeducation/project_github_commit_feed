const http = require('http');
const fs = require('fs');
const url = require('url');
const github = require('./modules/github_wrapper')
let commitFeed = require('./data/commits.json');
const scrubData = require('./modules/scrubData');

const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let updatedCommitData;

const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        renderHTML(res, JSON.stringify(commitFeed, null, 2));
    }

    else if (url.parse(req.url).pathname === '/commits') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        getCommits(getUserAndRepo(req, res), res);
        res.end();
    }

    else if (url.parse(req.url).path === '/github/webhooks' && req.method === 'POST') {
        res.writeHead(200, headers);

        let p = new Promise((resolve) => {
            extractPostData(req, resolve);
        });

        p.then((data) => {
            console.log(data);
            getCommits({ 'user': data.pusher.name, 'repo': data.repository.name }, res);
            res.end('200 OK');
        })
            .catch((err) => {
                console.log(err);
            });
    }
    else {
        res.statusCode = 200;
        res.end(`You made a ${req.method} request`);
    }
});


//read the html file into res.write and insert the appropriate JSON commit by replacing {{commitFeed}} in the html file
let renderHTML = (res, commitData) => {
    //let commitFeedString = JSON.stringify(commitFeed, null, 2) || "";

    fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace('{{commitFeed}}', commitData);
        res.write(data);
    });
}

//return the user and repo info when form in submitted
let getUserAndRepo = (req, res) => {
    let path = url.parse(req.url).path;
    let user = /user=([^&|?|///|]*)/.exec(path);
    let repo = /repo=([^&|?|///|]*)/.exec(path);
    return { 'user': user[1], 'repo': repo[1] };
}

//call the github API and retrieve the data with the passed in user and repo name. Takes res paramter in order to pass into renderHTML method
let getCommits = (formData, res) => {
    let commitFeedString = JSON.stringify(commitFeed, null, 2);
    github.init();
    github.authenticate();
    github.getCommits(formData.user, formData.repo, (err, feed) => {
        if (err) throw err;
        //Formate (scrub the data) to output only the necessary information and save to commits.json, return the updated json to be rendered in the html
        updatedCommitData = scrubData.formatData(feed.data, commitFeedString);
        renderHTML(res, updatedCommitData);
    });
}



//Get data from the requested objected and attach it to the requested object body
let extractPostData = (req, done) => {
    var body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        let result = JSON.parse(decodeURIComponent(body).slice(8)); //remove payload= which is a length of 8
        console.log(result);
        done(result);
    });
}

server.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
})