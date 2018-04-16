function add_one(){
	$.ajax({
		url: '/tip/00000/',
		type: 'POST',
		data: {'op': 'create'},
		success: function(data) {
			data = JSON.parse(data);
			window.location.href = '/tip/' + data['hid'] + '/'
		}
	});
}