const fs = require("fs");

function render(filename, content) {
  return new Promise(resolve => {
    fs.readFile("./views/" + filename, "utf8", (err, data) => {
      if (err) throw err;

      var htmlBody = "";
      const rowTemplate = fs
        .readFileSync("./views/elements/row.html", "utf8")
        .replace(/\n/g, "");

      rowTemplate.replace(/{{sha}}/gi, "foobar");

      content.forEach(commit => {
        var commitRow = rowTemplate;
        for (let k in commit) {
          var token = "{{" + k + "}}";
          commitRow = commitRow.replace(token, commit[k]);
        }
        htmlBody = htmlBody.concat(commitRow);
      });
			
      resolve(data.replace(new RegExp("{{content}}", "gi"), htmlBody));
    });
  });
}

module.exports = render;
