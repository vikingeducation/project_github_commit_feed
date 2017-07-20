const fs = require("fs");

let saver = input => {
  fs.readFile("./data/commits.json", (err, data) => {
    if (err) throw err;
    let temp = JSON.parse(data);
    let tempArr = [];
    tempArr.push(temp);
    tempArr.push(input);
    fs.writeFile(
      "./data/commits.json",
      JSON.stringify(tempArr, null, 2),
      err => {
        if (err) throw err;
      }
    );
  });
};
module.exports = saver;
