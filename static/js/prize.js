$(document).ready(function(){
	
});

function deletee(node) {
	var pid = $(node).parent().attr("pid");
	if (confirm("确认删除？")) {
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {"op": "delete", "pid": pid},
			success: function(data) {
				var data = JSON.parse(data);
				window.location.reload();
			}
		});
	}
}

function change_credit(node) {
	var pid = $(node).parent().attr("pid");
	var p = $("p#credit");
	var new_credit = prompt('新的积分', '');
	if (new_credit == null) new_credit = p.html();
	if (new_credit == '') new_credit = p.html();
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_credit', 'credit': new_credit, 'pid': pid},
		success: function(data) {
			var data = JSON.parse(data);
			p.html(new_credit);
		}
	});
}