$(document).ready(function() {
	$('form').on('submit', function(e) {
		// Fetch input values.
		let username = $('input#username').val();
		let repository = $('input#repository').val();

		window.location = `/${username}/${repository}`;

		e.preventDefault();
		return true;
	});

	gatherCommitNames();
});

function gatherCommitNames() {
	let names = [];
	$('.commit-name').each(function(idx, el) {
		const $el = $(el);
		const name = $el[0].innerText.slice(6);
		if (!names.includes(name))
			names.push(name);
	});

	console.log(names);
}
