const fs = require("fs");

function render(filename, content) {
  return new Promise(resolve => {
    fs.readFile("./views/" + filename, "utf8", (err, data) => {
      if (err) throw err;

      var htmlBody = "";

      if (content.length > 0) {
        const filterElement = fs.readFileSync(
          "./views/elements/filter.html",
          "utf8"
        );
        if (filterElement) {
          htmlBody = htmlBody.concat(filterElement);
        }
      }

      const rowTemplate = fs.readFileSync("./views/elements/row.html", "utf8");
      if (rowTemplate) {
        rowTemplate.replace(/{{sha}}/gi, "foobar");

        content.forEach(commit => {
          var commitRow = rowTemplate;
          for (let k in commit) {
            var token = new RegExp("{{" + k + "}}", "gi");
            commitRow = commitRow.replace(token, commit[k]);
          }
          htmlBody = htmlBody.concat(commitRow);
        });

        resolve(data.replace(new RegExp("{{content}}", "gi"), htmlBody));
      } else {
        reject(Error("Template not found!"));
      }
    });
  });
}

function renderError(error) {
  return new Promise(resolve => {
    fs.readFile("./views/index.html", "utf8", (err, data) => {
      if (err) throw err;
      resolve(
        data.replace(
          new RegExp("{{content}}", "gi"),
          '<h2 class="error">' + error + "</h2>"
        )
      );
    });
  });
}

module.exports = { render: render, renderError: renderError };
