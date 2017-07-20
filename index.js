const fs = require("fs");
let http = require("http");
let port = process.env.PORT || 3000;

let host = "localhost";
const user_name = "karathrash";
const repo = "project_github_commit_feed";

const git = require("./lib/github_wrapper");
const json = require("./public/commits.json");

const lineBlocks = "==================================";

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
  //console.log(req.url);

  /* ROUTING CODE */
  res.writeHeader(200, { "Content-type": "text/html" });
  var data = fs.readFileSync("./public/index.html", "UTF-8");
  if (req.url === "/") {
    fs.writeFileSync("./public/commits.json", lineBlocks);
    //  res.writeHeader(200, { "Content-type": "text/html" });
    //var data = fs.readFileSync("./public/index.html", "utf-8");
  } else if (req.url.includes("commits")) {
    //grab necessary params from url so we can call the api
    var request_url = parse_url(req.url);

    console.log(request_url);
    /* API CALL CODE */
    git.repos(request_url).then(
      message => {
        console.log(message);

        fs.writeFileSync(
          "./public/commits.json",
          message[0]["author"] + "/n" + lineBlocks + "/n" + json
        );
      },
      err => {
        console.log(err);
      }
    );
    //parse our html and remove {{ commitFeed }}
    //replace it with our json object
    //debugger;

    data = data.replace("{{ commitFeed }}", JSON.stringify(json, null, 2));
  } else {
  }
  res.end(data);
  /*
  res.writeHeader(200, { "Content-type": "text/html" });
  var data = fs.readFileSync("./public/index.html", "utf-8");

  //parse our html and remove {{ commitFeed }}
  //replace it with our json object
  //debugger;
  data = data.replace("{{ commitFeed }}", JSON.stringify(json, null, 2));

  res.end(data);
  //console.log(req.url);*/
  console.log("server on");
});

server.listen(port, host, () => {
  console.log(`Listening at: http://${host}:${port}`);
});

/*
var TestScript = function(buttt) {
  buttt.innerhtml = "sadasdasd";
  console.log("this is the test script");
};*/

/* API CALL CODE */
/*git.repos(params).then(
  message => {
    console.log(message);
  },
  err => {
    //console.log(err);
  }
);*/
//module.exports = { TestScript: "TestScript" };
