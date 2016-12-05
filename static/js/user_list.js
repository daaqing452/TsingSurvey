function refreshUserList(user_list) {
	$('table#user_list').empty();
	$('table#user_list').append('\
		<tr>\
			<td> </td>\
			<td align=center> 学号 </td>\
			<td align=center> 姓名 </td>\
			<td align=center> 是否为样本 </td>\
		</tr>\
	');
	for (i in user_list) {
		var username = user_list[i]['username'];
		var is_sample = '√';
		if (user_list[i]['is_sample'] == 0) is_sample = '';
		$('table#user_list').append('\
			<tr>\
				<td> <input type=\'checkbox\' username=\'' + username + '\' /> </td>\
				<td> ' + username + ' </td>\
				<td> 黄晓明 </td>\
				<td align=center> ' + is_sample + ' </td>\
			</tr>\
		');
	}
}

$(document).ready(function(){
	//	加载
	$.ajax({
		url: '/user_list/',
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
			url: '/user_list/',
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
			url: '/user_list/',
			type: 'POST',
			data: {'op': 'sample_no', 'username_list': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refreshUserList(data['user_list']);
			}
		});
	});

	//	添加管理员
	/*$('button#add').click(function(){
		var username = $('input#add').val();
		$.ajax({
			url: '/admin_list/',
			type: 'POST',
			data: {'op': 'add', 'username': username},
			success: function(data) {
				data = JSON.parse(data);
				if (data['result'] == 'yes') {
					refreshAdminList(data['admin_list']);
					$('input#add').val();
					alert('添加成功');
				} else {
					alert('不存在此用户');
				}
			}
		});
	});*/
});