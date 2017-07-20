const wrapper = require('./wrapper.js');

const parser = (req, res) => {
  var body = "";
  req.on("data", data => {
    body += data;
    console.log(body);
  });
  req.on("end", () => {
    let bodyArray = body.split("&");
    let username = bodyArray[0].split("=")[1];
    let repo = bodyArray[1].split("=")[1];
    wrapper.getCommits(username, repo); 
  });
}

module.exports = parser;