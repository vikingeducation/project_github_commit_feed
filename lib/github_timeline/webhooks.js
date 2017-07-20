function handleWebHooks(req, res) {
  let _headers = {
	  "Content-Type": "text/html",
	  "Access-Control-Allow-Origin": "*",
	  "Access-Control-Allow-Headers": "Content-Type",
	  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
	};

  res.writeHead(200, _headers);

  let trimmed = decodeURIComponent(req.body).slice(8);
  let decoded = JSON.parse(trimmed);


  console.log(decoded);
}

module.exports = handleWebHooks;
