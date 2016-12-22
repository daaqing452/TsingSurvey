$(document).ready(function(){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			data = JSON.parse(data);
			title = data['title'];
			qstring = data['qstring'];

			$('input#title').val(title);
			$('p#title').html(title)
			show(qstring);
			questions = JSON.parse(qstring);
		}
	});
});