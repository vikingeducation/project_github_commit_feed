const http = require('http');
const request = require('request');

var Github = () => {
  var object = {
    authenticate: (token) => {
      object.authorization = token;
    },

    getCommits: (obj) => {
      var options = {
        url: `https://api.github.com/repos/${ obj.owner }/${ obj.repo }/commits`,
        headers: {
          'User-Agent': 'Viking',
          'Authorization': `token ${ object.authorization }`
        }
      };

      return new Promise((resolve, reject) => {
        request.get(options, (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            if (res.statusCode == 200) {
              body = JSON.parse(body);
              resolve(body);
            } else {
              reject(res);
            }
          }
        });
      });
    }
  };

  return object;
};

module.exports = Github;
