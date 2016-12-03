function f() {
	alert('xxx');
}

$(document).ready(function(){
	//	删除管理员
	$('td#delete').on('click', function(){
	//$('td#delete').click(function(){
		if (confirm('确实要删除该管理员?')) {
			var username = $(this).attr('value');
			$.ajax({
				url: '/adminlist/',
				type: 'POST',
				data: {'op': 'delete', 'username': username},
				success: function(data) {
					data = JSON.parse(data);
					$('tr#' + username + '').remove();
				}
			});
		}
	});

	//	添加管理员
	$('button#add').click(function(){
		var username = $('input#add').val();
		$.ajax({
			url: '/adminlist/',
			type: 'POST',
			data: {'op': 'add', 'username': username},
			success: function(data) {
				data = JSON.parse(data);
				if (data['result'] == 'yes') {
					$('table#adminlist').children('tbody').append('\
						<tr id=\'' + username + '\'>\
							<td> ' + username + ' </td>\
							<td> 黄晓明 </td>\
							<td id=\'delete\' value=\'' + username + '\' onclick=\'f()\'> 删除 </td>\
						</tr>\
					');
					$('input#add').val('');
					alert('添加成功');
				} else {
					alert('不存在此用户');
				}
			}
		});
	});
});