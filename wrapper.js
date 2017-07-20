const Github = require("github");
const saver = require("./saver.js");


const github = new Github({ debug: true });

module.exports = {
  authenticateWithToken(token) {
    github.authenticate({
      type: "token",
      token: "userToken"
    });
  },

  getCommits(uname, rep) {
    github.repos.getCommits(
      {
        owner: uname,
        repo: rep
      },
      function(err, res) {
//        console.log(res.data[0].sha);
  //      console.log(res.data[0].commit.author);
    //    console.log(res.data[0].commit.message);
      //  console.log(res.data[0].commit.url);
        let results = {
          sha: res.data[0].sha,
          author: res.data[0].commit.author,
          message: res.data[0].commit.message,
          url: res.data[0].commit.url
        };
        console.log(results);
        saver(results);
      }
    );
  }
};
