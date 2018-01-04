function refreshAdminList(admin_list) {
	var tbody = $('table#admin_list').children('tbody');
	$('[type="item"]').remove();
	for (i in admin_list) {
		var uid = admin_list[i]['uid'];
		var username = admin_list[i]['username'];
		var name = admin_list[i]['name'];
		var tr = $('[type="clone"]').clone();
		tr.attr('type', 'item');
		tr.find('[type="username"]').text(username);
		tr.find('[type="username"]').attr('href', '/profile/' + uid + '/');
		tr.find('[type="name"]').text(name);
		var s = '';
		if (admin_list[i]['admin_chief']) {
			s += '高级 ';
			tr.find('button#up_chief').hide();
		} else {
			tr.find('button#dw_chief').hide();
		}
		if (admin_list[i]['admin_survey']) {
			s += '问卷发布 ';
			tr.find('button#up_survey').hide();
		} else {
			tr.find('button#dw_survey').hide();
		}
		tr.find('[type="level"]').text(s);
		tr.find('[type="operation"]').attr('username', username);
		tr.show();
		tbody.append(tr);
	}
}

function add_admin(username, level, value) {
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'add', 'username': username, 'level': level, 'value': value},
		success: function(data) {
			var data = JSON.parse(data);
			if (data['ulen'] > 0) {
				refreshAdminList(data['admin_list']);
				$('input#add').val('');
				alert('操作成功！');
			} else {
				alert('用户不存在！');
			}
		}
	});
}

function up_chief(node) {
	add_admin($(node).parent().attr('username'), 'chief', 1);
}

function dw_chief(node) {
	add_admin($(node).parent().attr('username'), 'chief', 0);
}

function up_survey(node) {
	add_admin($(node).parent().attr('username'), 'survey', 1);
}

function dw_survey(node) {
	add_admin($(node).parent().attr('username'), 'survey', 0);
}

$(document).ready(function(){
	//	加载
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			var data = JSON.parse(data);
			refreshAdminList(data['admin_list']);
		}
	});

	$('button#add_chief').click(function(){
		add_admin($('input#add').val(), 'chief', 1);
	});

	$('button#add_survey').click(function(){
		add_admin($('input#add').val(), 'survey', 1);
	});
});