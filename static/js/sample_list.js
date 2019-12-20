// 刷新用户列表
function refresh_user_list(user_list) {
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

// 刷新样本列表
function refresh_sample_list() {
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'get_sample_list'},
		success: function(data) {
			data = JSON.parse(data);
			sample_lists = data['sample_lists'];
			var select = $('select#sample_lists');
			select.empty();
			select.append("<option value='-1'> 请选择样本列表 </option>");
			for (var i in sample_lists) {
				var sample_list = sample_lists[i];
				select.append("<option value='" + sample_list['id'] + "'> " + sample_list['name'] + ' </option>');
			}
			select.val(data['sample_list_id']);
		}
	});
}

/*function show_statistic(obj) {
	var button = $(obj);
	var select = button.parent().children('select');
	var option = select.find('option:selected');
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'show_statistic', 'index': option.val()},
		success: function(data) {
			data = JSON.parse(data);
			button.parent().children('span').text(JSON.stringify(data['result']));
		}
	});
}*/

/*function constraint_select_change(obj) {
	var select = $(obj);
	var option = select.find('option:selected');
	$.ajax({
		url: window.location.href,
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
}*/

$(document).ready(function(){

	// 加载
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			var data = JSON.parse(data);
			refresh_user_list(data['user_list']);
			refresh_sample_list();
			$('span#sample_list_size').text(data['sample_list_size']);
		}
	});

	// 更改样本列表
	$("select#sample_lists").change(function() {
		var sample_list_id = $("select#sample_lists").val();
		window.location.href = '/sample_list/?samplelist=' + sample_list_id;
	});

	// 新建样本列表
	$('button#new_sample_list').click(function() {
		var sample_list_name = prompt('新建样本列表名称', '');
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'new_sample_list', 'sample_list_name': sample_list_name},
			success: function(data) {
				data = JSON.parse(data);
				$('select#sample_lists').append("<option value='" + data['id'] + "'>" + data['name'] + "</option>");
				$('select#sample_lists').val(data['id']);
			}
		});
	});

	// 导出样本列表
	$('button#export_sample_list').click(function() {

	});

	// 删除样本列表
	$('button#delete_sample_list').click(function() {

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
			url: window.location.href,
			type: 'POST',
			data: {'op': 'sample_yes', 'username_list': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refresh_user_list(data['user_list']);
			}
		});
	});

	//	设置为非样本
	$('button#sample_no').click(function(){
		username_list = new Array();
		$('input[username]:checked').each(function(){
			username_list.push($(this).attr('username'));
		});
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'sample_no', 'username_list': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refresh_user_list(data['user_list']);
			}
		});
	});

	// 添加样本限制条件
	$('button#add_constraint').click(function(){
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'get_field_chinese'},
			success: function(data) {
				data = JSON.parse(data);
				options = data['options'];
				var div = $('div#constraint');
				var select = div.children('[type="clone"]').clone();
				select.attr('type', 'item');
				var a = new Array(33, 4, 6, 9, 13, 40);
				for (var j in a) {
					var i = a[j];
					select.append('<option value="' + i + '">' + options[i] + '</option>');
				}
				select.show();
				div.append(select);
			}
		});
	});

	//	自动筛选
	$('button#auto_sample').click(function() {
		var constraints = [];
		var div = $('div#constraint');
		div.children('[type="item"]').each(function() {
			var value = $(this).val();
			if (value == -1) return;
			constraints.push(value);
		});
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'auto_sample', 'constraints': JSON.stringify(constraints), 'upperbound': $('input#upperbound').val()},
			success: function(data) {
				data = JSON.parse(data);
				window.location.href='/user_list/?list=all';
			}
		});
	});

	// 添加统计
	$('button#show_statistic').click(function(){
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'show_statistic'},
			success: function(data) {
				data = JSON.parse(data);
				statistic = data['statistic'];
				n_susers = parseInt(data['n_susers']);
				var table = $('table#statistic');
				for (var key in statistic) {
					var tr = table.find('[type="clone"]').clone();
					tr.attr('type', 'item');
					values = statistic[key];
					tr.append('<td>' + key + '</td>');
					for (var value in values) {
						s = '<td>' + value + ': ';
						var d = parseInt(values[value]);
						s += d + ' (' + (100.0 * d / n_susers) + '%) </td>';
						tr.append(s);
					}
					table.append(tr);
				}
			}
		});
	});

	// 清空所有样本
	$('button#clear_all_sample').click(function() {
		if (confirm('确认清空所有的样本？')) {
			$.ajax({
				url: window.location.href,
				type: 'POST',
				data: {'op': 'clear_all_sample'},
				success: function(data) {
					var data = JSON.parse(data);
					refresh_user_list(data['user_list']);
				}
			});
		}
	});
});
