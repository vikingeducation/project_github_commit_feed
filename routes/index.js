const express = require('express');
const router = express.Router();
const apiWrapper = require("../lib/apiWrapper");




/* GET home page. */
router.get('/', function(req, res, next) {
  apiWrapper.authenticate();
  apiWrapper.getCommits().then(results => {
    res.render('index', {
      title: 'Github Commit Feed',
      commits: apiWrapper.parseData(results.data)
    });
  });

  
});

module.exports = router;
