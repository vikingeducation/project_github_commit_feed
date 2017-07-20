const fs = require('fs');

function handlePublic(req, res) {
  let filename = req.params.resource;

  fs.readFile(`./public/${filename}`, (err, staticFile) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      console.warn(`File not found: ${err.message}`);
    } else {
      res.statusCode = 200;
      res.end(staticFile.toString(), 'text/plain');
    }
  });
}

module.exports = handlePublic;
