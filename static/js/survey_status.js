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
	// save function is here
	return;
}

function filter_op(){
	$("#myModal_body").empty();
	$("#myModal_body").append("<button>123</button>");
}

