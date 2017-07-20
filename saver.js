const fs = require("fs");


let saver = input => {
  fs.readFile('./data/commits.json', (err, data) => {
    if (err) throw err;
    console.log(data);
    let temp = JSON.parse(data);
    let tempArr = []
    tempArr.push(temp);
    tempArr.push(input);
    fs.writeFile("./data/commits.json", JSON.stringify(tempArr, null, 2), (err) => {
      if (err) throw err;
 //     console.log('test');
     });
  })
  ;
};
 module.exports = saver