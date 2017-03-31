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
		tr.find('[type="is_sample"]').text(is_sample);
		tr.find('[type="credit"]').text(credit);
		tr.show();
		tbody.append(tr);
	}
}

function show_statistic(obj) {
	var button = $(obj);
	var select = button.parent().children('select');
	var option = select.find('option:selected');
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'show_statistic', 'index': option.val()},
		success: function(data) {
			data = JSON.parse(data);
			button.parent().children('span').text(JSON.stringify(data['result']));
		}
	});
}

function constraint_select_change(obj) {
	var select = $(obj);
	var option = select.find('option:selected');
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'constraint_select_change', 'index': option.val()},
		success: function(data) {
			data = JSON.parse(data);
			var values = data['values'];
			var div = select.parent();
			div.attr('value', data['index']);
			div.children('[name="item"]').remove();
			for (i in values) {
				var input = div.children('[name="checkbox_clone"]').clone();
				input.attr('name', 'item');
				input.val(values[i]);
				input.show();
				var span = div.children('[name="span_clone"]').clone();
				span.attr('name', 'item');
				span.append(values[i]);
				span.append('&nbsp;&nbsp;&nbsp;');
				span.show();
				div.append(input);
				div.append(span);
			}
		}
	});
}

function change_credit(obj) {
	var new_credit = prompt('新的积分', '');
	var td = $(obj);
	if (new_credit == null) new_credit = td.html();
	if (new_credit == '') new_credit = td.html();
	td.html(new_credit);
}

$(document).ready(function(){

	//	加载
	$.ajax({
		url: window.location.href,
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
		if (confirm('确认删除？')) {
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
					alert('添加成功！');
				} else {
					alert(data['result']);
				}
			}
		});
	});

	//	添加统计
	$('button#add_statistic').click(function(){
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'add_statistic'},
			success: function(data) {
				data = JSON.parse(data);
				options = data['options'];
				var div = $('div#statistic');
				var subdiv = div.children('[type="clone"]').clone();
				subdiv.attr('type', 'item');
				var select = subdiv.children('select');
				for (i in options) {
					select.append('<option value="' + i + '">' + options[i] + '</option>');
				}
				subdiv.show();
				div.append(subdiv);
			}
		});
	});

	//	添加样本限制条件
	$('button#add_constraint').click(function(){
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'add_constraint'},
			success: function(data) {
				data = JSON.parse(data);
				options = data['options'];
				var div = $('div#constraint');
				var subdiv = div.children('[type="clone"]').clone();
				subdiv.attr('type', 'item');
				subdiv.attr('value', -1);
				var select = subdiv.children('select');
				for (i in options) {
					select.append('<option value="' + i + '">' + options[i] + '</option>');
				}
				subdiv.show();
				div.append(subdiv);
			}
		});
	});

	//	自动筛选
	$('button#auto_sample').click(function() {
		var constraints = {};
		var div = $('div#constraint');
		var childrens = div.children('[type="item"]');
		div.children('[type="item"]').each(function() {
			var value = $(this).attr('value');
			if (value == -1) return;
			var item = new Array();
			$(this).children('input:checkbox:checked').each(function() {
				item.push($(this).val());
			});
			constraints[value] = item;
		});
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'auto_sample', 'constraints': JSON.stringify(constraints), 'upperbound': $('input#upperbound').val()},
			success: function(data) {
				data = JSON.parse(data);
				refreshUserList(data['user_list']);
			}
		});
	});

	//	导出名单
	$('button#export').click(function() {
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'export'},
			success: function(data) {
				data = JSON.parse(data);
				export_path = '/' + data['export_path'];
				$('a#download').attr('href', export_path);
				document.getElementById("download").click();
			}
		});
	});
});