$(document).ready(function(){
	
});

function deletee(node) {
	var pid = $(node).parents("tr").eq(0).attr("pid");
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
	var pid = $(node).parents("tr").eq(0).attr("pid");
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

function change_price(node) {
	var pid = $(node).parents("tr").eq(0).attr("pid");
	var p = $("p#price");
	var new_price = prompt('新的金额', '');
	if (new_price == null) new_price = p.html();
	if (new_price == '') new_price = p.html();
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_price', 'price': new_price, 'pid': pid},
		success: function(data) {
			var data = JSON.parse(data);
			p.html(new_price);
		}
	});
}

function exchange(node) {
	var pid = $(node).parents("tr").eq(0).attr("pid");
	if (confirm("确认兑换？")) {
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {"op": "exchange", "pid": pid},
			success: function(data) {
				var data = JSON.parse(data);
				var result = data["result"];
				if (result == "ok") {
					alert("兑换成功！");
					window.location.reload();
				} else {
					alert(result);
				}
			}
		});
	}
}

function view_exchange(node) {
	var pid = $(node).parents("tr").eq(0).attr("pid");
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'view_exchange', 'pid': pid},
		success: function(data) {
			var data = JSON.parse(data);
		}
	});
}