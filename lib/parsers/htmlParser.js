var htmlParser = {
  parse: function(html, str, obj){
    var regex = new RegExp(str,"g");
    html = html.replace(regex, JSON.stringify(obj, null, 2))
    return html
  }
}

module.exports = htmlParser;

