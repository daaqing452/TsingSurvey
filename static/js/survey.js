$(document).ready(function(){
	$('button#submit').click(function(){
		if (confirm('确认提交？')) {
			var credit = 110;

			$.ajax({
				url: '/bonus/',
				type: 'POST',
				data: {'op': 'add_credit', 'credit': credit},
				success: function(data) {
					data = JSON.parse(data);
				}
			});

			$('form#submit_form');
		}
	});
});