$(document).ready(function(){
	
});

function change_nickname(node) {
	var sid = $(node).parents("tr").eq(0).attr("sid");
	var p = $(node).parents("tr").find("p#nickname");
	var new_nickname = prompt('新的奖品名称', '');
	if (new_nickname == null) new_nickname = p.html();
	if (new_nickname == '') new_nickname = p.html();
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_nickname', 'nickname': new_nickname, 'sid': sid},
		success: function(data) {
			var data = JSON.parse(data);
			p.html(new_nickname);
		}
	});
}

function remove_prize_from_store(node) {
	if (confirm('确认删除？')) {
		var pid = $(node).attr("pid");
		var sid = $(node).parents("tr").eq(0).attr("sid");
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'remove_prize_from_store', 'pid': pid, 'sid': sid},
			success: function(data) {
				var data = JSON.parse(data);
				$(node).remove();
			}
		});
	}
}