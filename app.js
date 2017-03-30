"use strict";

const GITHUB_API_KEY = require('./config').GITHUB_API_KEY;
let github = require('./githubapiwrapper')(GITHUB_API_KEY);



//Configuration object for the getCommits function
let commitsConfig = {
    'owner': 'rttomlinson',
    'repo': 'project_prep_facebook_pages'
};

//Get all repos names as an array for the current user


let p = github.repos.getAll({});
p.then(function onFulfilled(data) {
    console.log(Object.keys(data));
    //console.log(data);
})
.catch(function onError(err) {
    console.log(err);
});

let pro = github.repos.getCommits(commitsConfig);
pro.then(function onFulfilled(data) {
    console.log(data);
})
.catch(function onError(err) {
    console.log(err);
});
