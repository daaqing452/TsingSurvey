$(document).ready(function(){

	$('button#search').click(function() {
		var keyword = $('input#keyword').val();
		if (keyword == '') return;
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'search', 'keyword': keyword},
			success: function(data) {
				data = JSON.parse(data);
			}
		});
	});

});