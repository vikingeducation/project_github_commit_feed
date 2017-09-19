const paramsRegex = /\:[^\/]*/;
const paramsRegexInsert = /[^\/]*/;
const subset = ["?", "+", "*", "(", ")"];

function _parsePath(path) {
  let params = {};
  // Begin our regix with start of line
  let pathRegex = new RegExp("^");

  // [':name', 'has', ':pet']
  if (path.length === 1) {
    path = "/";
    pathRegex = new RegExp(pathRegex.source + path);
  } else {
    pathParts = path.slice(1).split("/");
    pathParts.forEach((part, index) => {
      // By default we just add the literal path part
      // 'has'
      let addition = part;
      if (part && paramsRegex.test(part)) {
        // Handle path parameters
        // ':pet' => '[^\\/]*'
        addition = paramsRegexInsert.source;

        // {2: 'pet'}
        params[index] = part.slice(1);
      }
      // Add this part onto the pathString
      pathRegex = new RegExp(pathRegex.source + "/" + addition);
    });
  }

  // End our pathRegex with end of line
  pathRegex = new RegExp(pathRegex.source + "$");
  return [pathRegex, params];
}

// Get our pathRegex and params. Return them
function parsePaths(path) {
  let [pathRegex, params] = _parsePath(path);
  return [pathRegex.source, params];
}

module.exports = parsePaths;
