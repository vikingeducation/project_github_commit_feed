"use strict";

const fs = require('fs');
const path = require('path');


let app = function () {
    return function(req, res) {
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
        
        //Read index.html file of public directory
        let p = new Promise(function (resolve, reject) {
            let cb = promiseWrap(resolve, reject);
            fs.readFile(path, {"encoding": encoding}, cb);
        });
        p.then(function onFulfilled(data) {
            res.end(data);
        })
        .catch(function onError(err) {
            res.end(err);
        });
        
        
    };
    
};



module.exports = app;