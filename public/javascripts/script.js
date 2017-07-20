$(document).ready(function() {
	console.log("ready");
	$('input[type=button]').click(function(e) {
		var $target = $(e.target);

		// Fetch input values.
		let username = $('input#username').val();
		let repository = $('input#repository').val();

console.log(username);
		window.location = `/${username}/${repository}`;

		e.preventDefault();
		return true;
	});
});
