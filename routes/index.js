const apiWrapper = require("../lib/apiWrapper");
const app = require("../lib/routeInit");

/* GET home page. */
router.get("/", function(req, res, next) {
  apiWrapper.authenticate();
  apiWrapper.getCommits().then(results => {
    res.statusCode = 200;

    // read in the file we need to display (index.html)

    res.end();

    // res.render('index', {
    //   title: 'Github Commit Feed',
    //   commits: apiWrapper.parseData(results.data)
    // });
  });
});

module.exports = router;
