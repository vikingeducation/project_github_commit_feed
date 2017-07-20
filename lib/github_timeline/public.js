function handlePublic(req, res) {
  console.log('public!');
  res.end('public');
}

module.exports = handlePublic;
