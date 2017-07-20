const Github = require('github');
const token = requre('../../token');

const githubOptions = {
  // Put options here, if needed
};

let github = new Github(githubOptions);
github.authenticate(token);
