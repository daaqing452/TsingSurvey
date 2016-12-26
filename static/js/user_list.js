function refreshUserList(user_list) {
	var tbody = $('table#user_list').children('tbody');
	$('[type="item"]').remove();
	for (i in user_list) {
		var uid = user_list[i]['uid'];
		var username = user_list[i]['username'];
		var name = user_list[i]['name'];
		var is_sample = '√';
		if (user_list[i]['is_sample'] == 0) is_sample = '';
		var tr = $('[type="clone"]').clone();
		tr.attr('type', 'item');
		tr.find('[type="checkbox"]').attr('username', username);
		tr.find('[type="username"]').text(username);
		tr.find('[type="username"]').attr('href', '/profile/' + uid + '/');
		tr.find('[type="name"]').text(name);
		tr.find('[type="is_sample"]').text(is_sample);
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
			refreshUserList(data['user_list']);
		}
	});

	//	全选
	$('button#select_all').click(function(){
		$('input[username]').each(function(){
			$(this).prop('checked', true);
		});
	});

	//	全不选
	$('button#select_none').click(function(){
		$('input[username]').each(function(){
			$(this).prop('checked', false);
		});
	});

	//	设置为样本
	$('button#sample_yes').click(function(){
		username_list = new Array();
		$('input[username]:checked').each(function(){
			username_list.push($(this).attr('username'));
		});
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'sample_yes', 'username_list': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refreshUserList(data['user_list']);
			}
		});
	});

	//	设置为样本
	$('button#sample_no').click(function(){
		username_list = new Array();
		$('input[username]:checked').each(function(){
			username_list.push($(this).attr('username'));
		});
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'sample_no', 'username_list': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refreshUserList(data['user_list']);
			}
		});
	});

	//	删除用户
	$('button#delete').click(function(){
		if (confirm('确实要删除用户?')) {
			var username_list = new Array();
			$('input[username]:checked').each(function(){
				username_list.push($(this).attr('username'));
			});
			$.ajax({
				url: window.location.pathname,
				type: 'POST',
				data: {'op': 'delete', 'username_list': JSON.stringify(username_list)},
				success: function(data) {
					data = JSON.parse(data);
					refreshUserList(data['user_list']);
				}
			});
		}
	});

	//	添加用户
	$('button#add').click(function(){
		var username = $('input#add').val();
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'add', 'username': username},
			success: function(data) {
				data = JSON.parse(data);
				if (data['result'] == 'yes') {
					refreshUserList(data['user_list']);
					$('input#add').val('');
					alert('添加成功');
				} else {
					alert(data['result']);
				}
			}
		});
	});
});