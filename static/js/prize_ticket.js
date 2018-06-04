$(document).ready(function(){

});

function exchange(item) {
	$('#qrcode').html('')
	var tid = $(item).attr("tid");
	var url = window.location.href.replace(window.location.pathname, "/prize_exchange/" + tid + "/");
	$('#qrcode').qrcode(url);
	$('#main').hide();
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {"op": "clear_scaned", "tid": tid},
		success: function(data) {
			var data = JSON.parse(data);
		}
	});
	window.setInterval(function(){ 
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {"op": "if_scan_qrcode", "tid": tid},
			success: function(data) {
				var data = JSON.parse(data);
				if (data['result'] == "scaned") {
					window.location.href = "/prize_exchange/" + tid + "/";
				} else {
					console.log("waiting...");
				}
			}
		})
	}, 1000);
}

function show_description(node){
	var description = $(node).attr("content");
	alert(description);

}

function clear_money() {
	var ticket = new Array();
	if (confirm("确定结算？")) {
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {"op": "clear_money"},
			success: function(data) {
				var data = JSON.parse(data);
				alert("结算成功！结算金额：" + data["money"]);
				window.location.reload();
			}
		});
	}
}

function refresh_prize_list(tp) {
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {"op": "refresh_prize_list", "type": tp},
		success: function(data) {
			var data = JSON.parse(data);
			var tickets = data['tickets'];
			var table = $("table#main");
			$("tr#item").remove();
			for (var i = 0; i < tickets.length; i++) {
				var t = tickets[i];
				var s = "<tr id='item' tid=" + t["tid"] + ">";
				s += "<td>" + t["title"] + "</td>";
				s += "<td>" + t["nickname"] + "</td>";
				s += "<td>" + t["credit"] + "</td>";
				s += "<td>" + t["price"] + "</td><td>";
				if (t["used"]) s += "√";
				s += "</td><td>";
				if (t["cleared"]) s += "√";
				s += "</td><td>" + t["use_time"] + "</td>";
				s += "<td>" + t["clear_time"] + "</td>";
				table.append(s);
			}
		}
	})
}