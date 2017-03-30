"use strict";

let Github = require('github');

function Session(apiKey) {
    //Create new instance of Github
    let github = new Github();
    
    //Authenticate the github instance
    github.authenticate({
        type:"token",
        token: apiKey
    });
    
    return github;
}







module.exports = Session;