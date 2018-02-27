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

function add_prize(node){
	$("#myModal_body").empty();
	var sid = $(node).parents("tr").eq(0).attr("sid");
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'get_prize_list', 'sid': sid},
		success: function(data) {
			var data = JSON.parse(data);
			var prize_list = data['prize_list'];
			$("#myModal_body").append("<span id='renew_prize_sid' style='display:none' sid=" + sid + " />");
			for (var i = 0; i < prize_list.length; i++) {
				var d = prize_list[i]
				var s = "<input name='item' type='checkbox' style='float:left' pid=" + d['pid'] + " title=" + d['title'] + " ";
				if (d['in']) s += "checked='checked'";
				s += " />";
				s += "<span style='float:left'>" + d['title'] + "</span>"
				s += "<br/>"
				$("#myModal_body").append(s);
			}
		}
	});
}

function commitRS(){
	var pid_list = new Array();
	var title_list = new Array();
	$("input[name='item']:checkbox:checked").each(function() {
		pid_list.push($(this).attr("pid"));
		title_list.push($(this).attr("title"));
	});
	var sid = $("span#renew_prize_sid").attr('sid');
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'renew_prize_for_store', 'sid': sid, 'pid_list': JSON.stringify(pid_list)},
		success: function(data) {
			var data = JSON.parse(data);
			var td = $("tr[sid=" + sid + "]").find("td#manage_prizes");
			td.empty();
			for (var i = 0; i < title_list.length; i++) {
				td.append(title_list[i]);
				td.append("&nbsp;");
			}
		}
	});
	$("#myModal").modal("hide");
}