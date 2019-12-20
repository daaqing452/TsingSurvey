// 刷新用户列表
function refreshUserList(user_list) {
	var tbody = $('table#user_list').children('tbody');
	tbody.find('[type="item"]').remove();
	for (i in user_list) {
		var uid = user_list[i]['uid'];
		var username = user_list[i]['username'];
		var name = user_list[i]['name'];
		var credit = user_list[i]['credit']
		var is_sample = '√';
		if (user_list[i]['is_sample'] == 0) is_sample = '';
		var tr = tbody.find('[type="clone"]').clone();
		tr.attr('type', 'item');
		tr.find('[type="checkbox"]').attr('username', username);
		tr.find('[type="username"]').text(username);
		tr.find('[type="username"]').attr('href', '/profile/' + uid + '/');
		tr.find('[type="name"]').text(name);
		//tr.find('[type="is_sample"]').text(is_sample);
		tr.find('[type="credit"]').text(credit);
		tr.show();
		tbody.append(tr);
	}
}

// 更改积分
function change_credit(obj) {
	var new_credit = prompt('新的积分', '');
	var td = $(obj);
	if (new_credit == null) new_credit = td.html();
	if (new_credit == '') new_credit = td.html();
	var username = td.parent().find('[type=username]').html();
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_credit', 'credit': new_credit, 'username': username},
		success: function(data) {
			data = JSON.parse(data);
		}
	});
	td.html(new_credit);
}

// 导出
function exportt(obj) {
	var button = $(obj);
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'export', 'size': button.attr('type')},
		success: function(data) {
			data = JSON.parse(data);
			export_path = '/' + data['export_path'];
			$('a#download').attr('href', export_path);
			document.getElementById("download").click();
		}
	});
}


$(document).ready(function(){

	//	加载
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			var data = JSON.parse(data);
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

	//	删除用户
	$('button#delete').click(function(){
		if (confirm('确认删除？')) {
			var username_list = new Array();
			$('input[username]:checked').each(function(){
				username_list.push($(this).attr('username'));
			});
			$.ajax({
				url: window.location.href,
				type: 'POST',
				data: {'op': 'delete', 'username_list': JSON.stringify(username_list)},
				success: function(data) {
					data = JSON.parse(data);
					refreshUserList(data['user_list']);
				}
			});
		}
	});

	//	删除所有用户
	$('button#delete_all').click(function(){
		if (confirm('确认删除所有用户？')) {
			$.ajax({
				url: window.location.href,
				type: 'POST',
				data: {'op': 'delete_all'},
				success: function(data) {
					data = JSON.parse(data);
					refreshUserList(data['user_list']);
				}
			});
		}
	});

	//	添加用户
	$('button#add_new_user').click(function(){
		var username = $('input#add_new_user').val();
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'add_new_user', 'username': username},
			success: function(data) {
				data = JSON.parse(data);
				if (data['result'] == 'yes') {
					refreshUserList(data['user_list']);
					$('input#add_new_user').val('');
					alert('添加成功！');
					window.location.reload();
				} else {
					alert(data['result']);
				}
			}
		});
	});

	// 显示名单
	$('button#list_add').click(function() {
		window.location.href = '/user_list/?list=all';
	});
	$('button#list_sample').click(function() {
		window.location.href = '/user_list/?list=sample';
	});
	$('button#list_single').click(function() {
		window.location.href = '/user_list/?list=q' + $('input#query_single').val();
	});
});
