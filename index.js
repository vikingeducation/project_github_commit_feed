const apiWrapper = require("./lib/apiWrapper");

apiWrapper.getCommits().then(results => {
  console.log(apiWrapper.parseData(results.data));
});
