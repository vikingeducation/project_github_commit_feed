"use strict";

const fs = require('fs');
const path = require('path');
const url = require('url');

//Get instance of githubapiwrapper
const GITHUB_API_KEY = require('./config').GITHUB_API_KEY;
let github = require('./githubapiwrapper')(GITHUB_API_KEY);

let app = function () {
    //App instance current commitData
    let _appCommitData = '';
    //Object that will hold functions used by the application
    let api = {};
    //Allows app to set commitData
    api.setCommitData = function setCommitData(commitData) {
        _appCommitData = commitData;
    };
    //The app request handler
    api.requestHandler = function(req, res) {
        //Need to be able to configure the path from the app.js file
        let path = './public/index.html';
        let encoding = 'utf8';

        //This function allows a error first callback to call resolve/reject of a promise
        function promiseWrap(resolve, reject) {
            return function errorFirstConverter(err, data) {
                if (err){
                    reject(err);
                }
                resolve(data);
            };
        }
        
        console.log('req.url:', req.url);
        //Check url path
        if (req.url == '/github/webhooks'){
            
            console.log("Hello webhooks");
            
        }
        
        
        
        

        //Parse the query string of the submitted form
        //console.log(req.url);
        let queryParams = url.parse(req.url, true).query;
        //console.log(queryParams);

        //Configuration object for the getCommits function
        let { user, repo } = queryParams;
        if(user !== undefined && repo !== undefined ){
          let commitsConfig = {
              'owner': user,
              'repo': repo
          };
          //Now send request to Github API using the getCommits function
          //Should also be wrapped in promise
          github.getCommits(commitsConfig)
          .then(function onFulfilled(data) {
              console.log('cleaned up data', data);
              //Write to commits.json file
              //Path to commits.json file
              // NOTE: The APPEND functionality is pending - currently overwriting each time we request
              let pathToCommits = './data/commits.json';
              let p = new Promise(function (resolve, reject) {
                  let cb = promiseWrap(resolve, reject);
                  fs.writeFile(pathToCommits, JSON.stringify(data, null, 2), cb);
              });
              p.then(function onFulfilled() {
                  console.log("Data appended successfully to commits.json");
              }, function onRejection(err) {
                  console.error('An error occured:', err);
              })
              .catch(function onError(err){
                  console.error("Error occurred while writing to commits.json", err);
              });


          });
        }
        // else{
        // }
        //console.log(user, repo);

        //Read index.html file of public directory
        let p = new Promise(function (resolve, reject) {
            let cb = promiseWrap(resolve, reject);
            fs.readFile(path, {"encoding": encoding}, cb);
        });
        p.then(function onFulfilled(data) {
            //Replace placeholder with the commitData returned from the server
            data = data.replace(/{{ commitFeed }}/, _appCommitData);

            res.end(data);
        })
        .catch(function onError(err) {
            res.end(err);
        });
    };
    return api;

};



module.exports = app;
