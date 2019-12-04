var order = '';
var reversed = 0;
var filter = '{}';

function refreshItemList(item_list) {
	var tbody = $('table#item_list').children('tbody');
	tbody.find('[type="item"]').remove();
	for (var i in item_list) {
		console.log(i);
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



$(document).ready(function(){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op':'get_list', 'order':order, 'reversed':reversed, 'filter':filter},
		success: function(data) {
			console.log(data);
			data = JSON.parse(data);
			filter = data['filter'];
			refreshItemList(data['item_list']);
		}
	});

	$("td.table_head").click(function(){
		var new_order = $(this).attr('type');
		if (order == new_order) {
			reversed = 1 - reversed;
		} else {
			order = new_order;
			reversed = 0;
		}
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {'op':'get_list', 'order':order, 'reversed':reversed, 'filter':filter},
			success: function(data) {
				data = JSON.parse(data);
				refreshItemList(data['item_list']);
			}
		});
	});
});


function commitS(){
	//console.log($("input#submitted_是").checked());
}

function add_filter_options(title, name) {
	var s = "<div style='float:left'><b>" + title + "</b>";
	for (var key in filter[name]) {
		s += "<input id='" + name + '_' + key + "' type='checkbox' checked=" + filter[name][key] + " />" + key + '&nbsp;&nbsp;&nbsp;';
	}
	s += "</div><br/><hr/>";
	return s;
}

function filter_op(){
	$("#myModal_body").empty();
	var s = "";
	s += add_filter_options('是否完成问卷', 'submitted');
	s += "<div style='float:left'><b>学号：</b><input type='text' value='" + filter['username'][0] + "' placeholder='20XXXXXXXX' />~<input type='text' value='" + filter['username'][1] + "' placeholder='20XXXXXXXX' /></div><br/><hr/>";
	s += "<div style='float:left'><b>提交时间：</b><input type='text' value='" + filter['submit_time'][0] + "' placeholder='XXXX-XX-XX XX:XX:XX' />~<input type='text' value='" + filter['submit_time'][1] + "' placeholder='XXXX-XX-XX XX:XX:XX' />&nbsp;&nbsp;&nbsp;</div><br/><hr/>";
	s += add_filter_options('学生类别：', 'student_type');
	s += add_filter_options('政治面貌：', 'political_status');
	s += add_filter_options('院 系 所：&nbsp;', 'department');
	s += add_filter_options('录取类别：', 'enrollment_mode');
	$("#myModal_body").append(s);
}

