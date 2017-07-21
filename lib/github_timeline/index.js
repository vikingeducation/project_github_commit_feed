const Router = require('../router');
const url = require('url');
const handleHomePage = require('./view');
const handleWebHooks = require('./webhooks');
const handlePublic = require('./public');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

let app = Router();

app.get('/', handleHomePage);
app.post('/github/webhooks', handleWebHooks);
app.get('/public/:resource', handlePublic);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
