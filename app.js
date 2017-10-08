const http = require('http');
const fs = require('fs');
const commits = require('./data/commits.json');


const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found.');
    }

    data = data.toString();
    const commitsStr = JSON.stringify(commits, null, 2);
    data = data.replace('{{ commitFeed }}', commitsStr);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
});


server.listen(3000, () => {
  console.log('Listening to port 3000');
});
