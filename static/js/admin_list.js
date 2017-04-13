function refreshAdminList(admin_list) {
	var tbody = $('table#admin_list').children('tbody');
	$('[type="item"]').remove();
	for (i in admin_list) {
		var uid = admin_list[i]['uid'];
		var username = admin_list[i]['username'];
		var name = admin_list[i]['name'];
		var tr = $('[type="clone"]').clone();
		tr.attr('type', 'item');
		tr.find('[type="checkbox"]').attr('username', username);
		tr.find('[type="username"]').text(username);
		tr.find('[type="username"]').attr('href', '/profile/' + uid + '/');
		tr.find('[type="name"]').text(name);
		tr.show();
		tbody.append(tr);
	}
}

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
		if (confirm('确认删除管理员？')) {
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
					alert('添加成功！');
				} else {
					alert('没有此用户！');
				}
			}
		});
	});
});