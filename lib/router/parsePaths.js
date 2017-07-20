const paramsRegex = /\:[^\/]*/;
const paramsRegexInsert = /[^\/]*/;
const subset = ['?', '+', '*', '(', ')'];

function _parsePath(path) {
  let params = {};

  // Begin our regix with start of line
  let pathRegex = new RegExp('^');

  // ':name/has/:pet'
  path = _cleanPath(path);
  // [':name', 'has', ':pet']
  pathParts = path.split('/');
  pathParts.forEach((part, index) => {
    // By default we just add the literal path part
    // 'has'
    let addition = part;

    if (part && _isStringPattern(part)) {
      // Handle string-based patterns
      // 'a+-b+e' => 'a+\-b+e'
      addition = _escapeStringPattern(part);
    } else if (part && paramsRegex.test(part)) {
      // Handle path parameters
      // ':pet' => '[^\\/]*'
      addition = paramsRegexInsert.source;
      // {2: 'pet'}
      params[index] = part.slice(1);
    }

    // Add this part onto the pathString
    pathRegex = new RegExp(pathRegex.source + '/' + addition);
  });

  // End our pathRegex with end of line
  pathRegex = new RegExp(pathRegex.source + '$');
  return [pathRegex, params];
}

// Make sure we have a nicely formatted path to parse
function _cleanPath(path) {
  path = path.trim();
  if (path[path.length - 1] === '/') {
    path = path.slice(0, path.length - 1);
  }
  if (path[0] === '/') {
    path = path.slice(1);
  }

  return path;
}

// Return true if a given path part is a string pattern
function _isStringPattern(part) {
  isPattern = false;

  for (let char of subset) {
    if (part.includes(char)) {
      isPattern = true;
      break;
    }
  }

  return isPattern;
}

// Escape the '-' and '.' characters in a given string pattern
function _escapeStringPattern(part) {
  sanitizedPart = '';
  part.split().forEach(char => {
    if (['-', '.'].includes(char)) {
      sanitizedPart += '//';
    }
    sanitizedPart += char;
  });

  return sanitizedPart;
}

// Get our pathRegex and params. Return them
function parsePaths(path) {
  let pathRegex = null;
  let params = {};
  if (path instanceof RegExp) {
    pathRegex = path;
  } else {
    [pathRegex, params] = _parsePath(path);
  }

  return [pathRegex.source, params];
}

module.exports = parsePaths;
