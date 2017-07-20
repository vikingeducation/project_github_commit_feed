const url = require("url");



module.exports = function parseURL(input) {
  let info = input.split("?")[1];
  return info;
}
