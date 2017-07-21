const fs = require("fs");

module.exports = function readHTML() {
  return new Promise((resolve, reject) => {
    fs.readFile("./public/index.html", "utf8", function(err, htmldata) {
      if (err) reject(err);
      resolve(htmldata);
    })
  })
};
