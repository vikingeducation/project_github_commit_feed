const fs = require("fs");
let http = require("http");
let port = process.env.PORT || 3000;

let host = "localhost";
const user_name = "karathrash";
const repo = "project_github_commit_feed";

const git = require("./lib/github_wrapper");
const json = require("./public/commits.json");

const lineBlocks = "==================================";
var new_json = {};
function parse_url(url) {
  //EXPECTED URL =  /commits?username=EricGlover&repo=project_github_commit_feed
  url_arr = url.split("&");
  var url_obj = {
    user: url_arr[0].replace("/commits?username=", ""),
    repo: url_arr[1].replace("repo=", "")
  };
  return url_obj;
}

/* SERVER CODE */
var server = http.createServer((req, res) => {
  /* ROUTING CODE */
  res.writeHeader(200, { "Content-type": "text/html" });
  var data = fs.readFileSync("./public/index.html", "UTF-8");
  if (req.url === "/") {
    var data = fs.readFileSync("./public/index.html", "utf-8");
    res.end(data);
  } else if (req.url.includes("commits")) {
    //grab necessary params from url so we can call the api
    var request_url = parse_url(req.url);

    /* API CALL CODE */
    git.repos(request_url).then(
      message => {
        UpdateJsonData(message);
        //make this json change in upadate json functio n
        // new_json = {
        //   0: {
        //     user: message[1].user,
        //     repo: message[1].repo,
        //     commits: message[0]
        //   }
        // };
        debugger;
        ////check to see if this user/repo combo is in the json
        ///then if yes skip
        ///if no append

        //parse our html and remove {{ commitFeed }}
        //replace it with our json object
        data = data.replace(
          "{{ commitFeed }}",
          JSON.stringify(new_json, null, 2)
        );
        res.end(data);
      },
      err => {
        console.log(err);
      }
    );
  } else {
  }

  console.log("server on");
});

var UpdateJsonData = function(newSearch) {
  var oldJsonSearch = require("./public/commits.json");
  for (var k in oldJsonSearch) {
    if (
      oldJsonSearch[k].user === newSearch[1].user &&
      oldJsonSearch[k].repo === newSearch[1].repo
    ) {
      return;
    }
  }
  //add to the json
  oldJsonSearch[oldJsonSearch.length] = {
    user: newSearch[1].user,
    repo: newSearch[1].repo,
    commits: newSearch[0]
  };
  fs.writeFile(
    "./public/commits.json",
    JSON.stringify(oldJsonSearch, null, 2),
    err => {
      if (err) {
        console.log(`Error writing = ${err}`);
      }
    }
  );
};

server.listen(port, host, () => {
  console.log(`Listening at: http://${host}:${port}`);
});
