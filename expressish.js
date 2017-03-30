"use strict";

const fs = require('fs');
const path = require('path');
const url = require('url');


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
        
        //Parse the query string of the submitted form
        console.log(req.url);
        let queryParams = url.parse(req.url, true).query;
        console.log(queryParams);
        
        
        
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