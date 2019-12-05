var order = '';
var reversed = 0;
var filter = {};

function refresh_item_list() {
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {'op':'get_list', 'order':order, 'reversed':reversed, 'filter':JSON.stringify(filter)},
		success: function(data) {
			data = JSON.parse(data);
			if (!('submitted' in filter)) filter = data['filter'];
			item_list = data['item_list'];
			var tbody = $('table#item_list').children('tbody');
			tbody.find('[type="item"]').remove();
			for (var i in item_list) {
				var item = item_list[i];
				var tr = tbody.find('[type="clone"]').clone();
				tr.attr('type', 'item');
				tr.find('[type="submitted"]').text(item['submitted']);
				tr.find('[type="username"]').text(item['username']);
				tr.find('[type="username"]').attr('href', '/profile/' + item['uid'] + '/');
				tr.find('[type="submit_time"]').text(item['submit_time']);
				tr.find('[type="student_type"]').text(item['student_type']);
				tr.find('[type="political_status"]').text(item['political_status']);
				tr.find('[type="department"]').text(item['department']);
				tr.find('[type="enrollment_mode"]').text(item['enrollment_mode']);
				tr.show();
				tbody.append(tr);
			}
		}
	});
}



$(document).ready(function(){
	refresh_item_list();

	$("td.table_head").click(function(){
		var new_order = $(this).attr('type');
		if (order == new_order) {
			reversed = 1 - reversed;
		} else {
			order = new_order;
			reversed = 0;
		}
		refresh_item_list();
	});
});


function renew_filter_checkbox(filter, name) {
	for (var key in filter[name]) filter[name][key] = $("#" + name + "_" + key).prop('checked');
}

function renew_filter(){
	renew_filter_checkbox(filter, 'submitted');
	filter['username'][0] = $('#username_lower').val();
	filter['username'][1] = $('#username_upper').val();
	filter['submit_time'][0] = $('#submit_time_lower').val();
	filter['submit_time'][1] = $('#submit_time_upper').val();
	renew_filter_checkbox(filter, 'student_type');
	renew_filter_checkbox(filter, 'political_status');
	renew_filter_checkbox(filter, 'department');
	renew_filter_checkbox(filter, 'enrollment_mode');
	$("#myModal").modal('hide');
	refresh_item_list();
}

function add_filter_options(title, name) {
	var s = "<table style='float:left'><tr><td><b>" + title + "</b></td>";
	var cnt = 0;
	for (var key in filter[name]) {
		cnt++;
		if (cnt % 5 == 1 && cnt > 1) {
			s += "</tr><tr><td></td>";
		}
		s += "<td style='float:left'><input id='" + name + '_' + key + "' type='checkbox' " + (filter[name][key] ? "checked='checked'" : "") + " />" + key + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
	}
	s += "</tr></table><br/><hr/>";
	return s;
}

function filter_op(){
	$("#myModal_body").empty();
	var s = "";
	s += add_filter_options('是否完成问卷：', 'submitted');
	s += "<div style='float:left'><b>学号：</b><input id='username_lower' type='text' value='" + filter['username'][0] + "' placeholder='20XXXXXXXX' />~<input id='username_upper' type='text' value='" + filter['username'][1] + "' placeholder='20XXXXXXXX' /></div><br/><hr/>";
	s += "<div style='float:left'><b>提交时间：</b><input id='submit_time_lower' type='text' value='" + filter['submit_time'][0] + "' placeholder='XXXX-XX-XX XX:XX:XX' />~<input id='submit_time_upper' type='text' value='" + filter['submit_time'][1] + "' placeholder='XXXX-XX-XX XX:XX:XX' />&nbsp;&nbsp;&nbsp;</div><br/><hr/>";
	s += add_filter_options('学生类别：', 'student_type');
	s += add_filter_options('政治面貌：', 'political_status');
	s += add_filter_options('院 系 所：&nbsp;', 'department');
	s += add_filter_options('录取类别：', 'enrollment_mode');
	$("#myModal_body").append(s);
}

