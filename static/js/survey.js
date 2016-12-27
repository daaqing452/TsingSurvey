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
			getindex(qstring);
			questions = JSON.parse(qstring);
		}
	});
});

function analysis() {
	var qid = $('p#qid').attr('qid');
	$.ajax({
		url: '/analysis/',
		type: 'POST',
		data: {'op': 'analysis', 'qid': qid},
		success: function(data) {
			data = JSON.parse(data);
			alert('Generate report successful');
			window.location.href = '/report/' + qid + '/';
		}
	});
}