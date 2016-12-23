$(document).ready(function(){
	$('#survey_create').click(function(){
		$.ajax({
			url: '/survey/00000/',
			type: 'POST',
			data: {'op': 'create'},
			success: function(data) {
				data = JSON.parse(data);
				window.location.href = '/survey/' + data['qid'] + '/'
			}
		});
	});
});