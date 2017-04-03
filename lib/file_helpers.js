const fs = require('fs');

function readFilePromise(path, scrubbedData) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, data) {
      data = JSON.parse(data);
      scrubbedData = scrubbedData.concat(data.data);
      let dataObj = { data: scrubbedData };
      dataObj = JSON.stringify(dataObj);
      return resolve(dataObj);
    });
  });
}

function writeFilePromise(path, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, 'utf8', function(err) {
      return resolve();
    });
  });
}

module.exports = {
  readFilePromise,
  writeFilePromise
}