const apiWrapper = require("../../lib/apiWrapper");

apiWrapper.authenticate();
apiWrapper.getCommits().then(results => {
  console.log(apiWrapper.parseData(results.data));
});
