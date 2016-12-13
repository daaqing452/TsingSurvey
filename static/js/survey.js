$(document).ready(function(){
	$('button#submit').click(function(){
		if (confirm('确认提交？')) {
			$.ajax({
				url: window.location.pathname,
				type: 'POST',
				data: {'op': 'submit'},
				success: function(data) {
					data = JSON.parse(data);
				}
			});
			window.location.href = '/bonus/';
		}
	});
});