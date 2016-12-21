$(document).ready(function(){
	//	加载
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			data = JSON.parse(data);
			refreshAdminList(data['admin_list']);
		}
	});

	//	删除管理员
	$('button#delete').click(function(){
		if (confirm('确实要删除管理员?')) {
			username_list = new Array();
			$('input[username]:checked').each(function(){
				username_list.push($(this).attr('username'));
			});
			$.ajax({
				url: window.location.pathname,
				type: 'POST',
				data: {'op': 'delete', 'username_list': JSON.stringify(username_list)},
				success: function(data) {
					data = JSON.parse(data);
					refreshAdminList(data['admin_list']);
				}
			});
		}
	});

	//	添加管理员
	$('button#add').click(function(){
		var username = $('input#add').val();
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'add', 'username': username},
			success: function(data) {
				data = JSON.parse(data);
				if (data['result'] == 'yes') {
					refreshAdminList(data['admin_list']);
					$('input#add').val('');
					alert('添加成功');
				} else {
					alert('不存在此用户');
				}
			}
		});
	});
});