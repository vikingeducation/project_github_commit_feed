$(document).ready(function() {
  $("form").on("submit", function(e) {
    // Fetch input values.
    let username = $("input#username").val();
    let repository = $("input#repository").val();

    window.location = `/${username}/${repository}`;

    e.preventDefault();
    return true;
  });

  gatherCommitNames().then((names) => {
    insertOptions(names).change(filterByName);
  });
});

function gatherCommitNames() {
  return new Promise(resolve => {
    let names = [];
    $(".commit-name").each(function(idx, el) {
      const $el = $(el);
      const name = $el[0].innerText.slice(6);
      if (!names.includes(name)) names.push(name);
    });
    resolve(names);
  });
}

function insertOptions(names) {
  var $menuFilter = $("#name-filter");
  names.forEach(function(name) {
    var $element = $("<option/>", { value: name, text: name });
    $menuFilter.append($element);
  });
  return $menuFilter;
}

function filterByName(e) {
  var selectedName = $(e.target).val().trim();

  var $commits = $(".commit");
  $commits.show();
  $commits.each(function(idx, commit) {
    var name = $(commit).data("name").trim();
    if (name !== selectedName)
      $(commit).hide();
  });
}
