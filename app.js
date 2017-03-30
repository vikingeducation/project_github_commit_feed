"use strict";

const GITHUB_API_KEY = require('./config').GITHUB_API_KEY;
let github = require('./githubapiwrapper')(GITHUB_API_KEY);
let http = require('http');
const path = require("path");

//Make app instance
let app = require('./expressish')();


//Set port
let port = process.env.PORT || 3000;


//Create new server
let server = http.createServer(app);


//Start listening on server
server.listen(port);




//Configuration object for the getCommits function
let commitsConfig = {
    'owner': 'rttomlinson',
    'repo': 'project_prep_facebook_pages'
};

let pro = github.repos.getCommits(commitsConfig);
pro.then(function onFulfilled(data) {
    console.log(data);
})
.catch(function onError(err) {
    console.log(err);
});
