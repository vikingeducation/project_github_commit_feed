const url = require("url");



module.exports = function parseURL(input) {
  let objInfo = {}

  if (input.includes("?")) {
	  let info = input.split("?")[1];
	  info = info.split("&");
	  info.forEach(function(el) {
	  	let pieces = el.split("=");
	  	objInfo[pieces[0]] = pieces[1];
	  });
  }
//
  return objInfo;
}
