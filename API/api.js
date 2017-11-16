'use strict';

var Github = require('github');
var git = Github();

class Gitwrap {
  constructor(repo, owner) {
    git.authenticate({
      type: 'token',
      token: '6c5e98cc360a8d6b5646d94f5ad9f06f121ceaf4'
    });

    git.repos.getCommits(
      {
        owner: `${owner}`,
        repo: `${repo}`
      },
      function(err, data) {
        console.log(data);
      }
    );
  }
}

var gitty = new Gitwrap();
console.log(gitty);
