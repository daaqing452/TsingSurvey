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
function refresh_sample_list(sample_lists, sample_list_id) {
	
}

$(document).ready(function(){

	// 加载
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			var data = JSON.parse(data);
			refresh_user_list(data['user_list']);
			$('span#sample_list_size').text(data['sample_list_size']);

			var sample_lists = data['sample_lists'];
			var sample_list_id = data['sample_list_id'];
			var select = $('select#sample_lists');
			select.empty();
			select.append("<option value='-1'> 请选择样本列表 </option>");
			for (var i in sample_lists) {
				var sample_list = sample_lists[i];
				select.append("<option value='" + sample_list['id'] + "'> " + sample_list['name'] + " </option>");
			}
			select.val(sample_list_id);

			var show_statistic_options = data['show_statistic_options'];
			var select = $('select#show_statistic_select');
			select.empty();
			for (var i in show_statistic_options) {
				var option_t = show_statistic_options[i];
				select.append("<option value='" + option_t[0] + "'> " + option_t[1] + " </option>");
			}
		}
	});

	// 更改样本列表
	$("select#sample_lists").change(function() {
		var sample_list_id = $("select#sample_lists").val();
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'change_sample_list'},
			success: function(data) {
				// do nothing
			}
		});
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
				var sample_list_id = data['id'];
				window.location.href = '/sample_list/?samplelist=' + sample_list_id;
			}
		});
	});

	// 保存样本列表
	$('button#save_sample_list').click(function() {
		var sample_list_id = $('select#sample_lists').val();
		var sample_list_name = $('select#sample_lists').find('option:selected').text();
		if (sample_list_id == -1) {
			alert('请选择样本列表');
		} else {
			if (confirm('确认要保存到当前列表（' + sample_list_name + '）吗？')) {
				$.ajax({
					url: window.location.href,
					type: 'POST',
					data: {'op': 'save_sample_list'},
					success: function(data) {
						data = JSON.parse(data);
						alert(data['info']);
						window.location.reload();
					}
				});
			}
		}
	});

	// 导出样本列表
	$('button#export_sample_list').click(function() {
		var sample_list_id = $('select#sample_lists').val();
		if (sample_list_id == -1) {
			alert('请选择样本列表');
		} else {
			$.ajax({
				url: window.location.href,
				type: 'POST',
				data: {'op': 'export_sample_list'},
				success: function(data) {
					data = JSON.parse(data)
					export_path = '/' + data['export_path'];
					$('a#download').attr('href', export_path);
					document.getElementById("download").click();
				}
			});
		}
	});

	// 删除样本列表
	$('button#delete_sample_list').click(function() {
		var sample_list_id = $('select#sample_lists').val();
		var sample_list_name = $('select#sample_lists').find('option:selected').text();
		if (sample_list_id == -1) {
			alert('请选择样本列表');
		} else {
			if (confirm('确认删除当前样本列表（' + sample_list_name + '）吗')) {
				$.ajax({
					url: window.location.href,
					type: 'POST',
					data: {'op': 'delete_sample_list'},
					success: function(data) {
						data = JSON.parse(data);
						alert(data['info']);
						window.location.href = '/sample_list/';
					}
				});
			}
		}
	});

	// 全选
	$('button#select_all').click(function(){
		$('input[username]').each(function(){
			$(this).prop('checked', true);
		});
	});

	// 全不选
	$('button#select_none').click(function(){
		$('input[username]').each(function(){
			$(this).prop('checked', false);
		});
	});

	// 设置为样本
	$('button#sample_yes').click(function(){
		username_list = new Array();
		$('input[username]:checked').each(function(){
			username_list.push($(this).attr('username'));
		});
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'sample_yes', 'usernames': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refresh_user_list(data['user_list']);
			}
		});
	});

	// 设置为非样本
	$('button#sample_no').click(function(){
		username_list = new Array();
		$('input[username]:checked').each(function(){
			username_list.push($(this).attr('username'));
		});
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'sample_no', 'usernames': JSON.stringify(username_list)},
			success: function(data) {
				data = JSON.parse(data);
				refresh_user_list(data['user_list']);
			}
		});
	});

	// 显示统计
	$('button#show_statistic').click(function() {
		var field = $('select#show_statistic_select').val();
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'show_statistic', 'field': field},
			success: function(data) {
				data = JSON.parse(data);
				alert(data['res']);
			}
		});
	});
});
