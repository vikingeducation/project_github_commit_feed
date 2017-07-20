let fs = require("fs");

let saver = input => {
  fs.appendFile("./data/commits.json", input, (err){
    if (err) throw err;
  });
};
