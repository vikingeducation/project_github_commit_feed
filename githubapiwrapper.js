"use strict";

let Github = require('github');


function Session(apiKey) {
    //Create new instance of Github
    let github = new Github();
    
    //Authenticate the github instance. Need to wrap in Promise
    github.authenticate({
        type:"token",
        token: apiKey
    });
    
    let session = {};
    
    //Needs to be moved to the githubwrapper.js module
    session.getCommits = function getCommits(commitsConfig) {
       let pro = github.repos.getCommits(commitsConfig);
        pro.then(function onFulfilled(data) {
            console.log("Fulfilled Called!");
            //console.log(data);
        }, function onRejected(err) {
            throw err;
        })
        .catch(function onError(err) {
            console.log("Error called!");
            console.log(err);
            //console.log(err);
        }); 
    };
    
    return session;
}


module.exports = Session;