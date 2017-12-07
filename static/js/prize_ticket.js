$(document).ready(function(){

});

function exchange(item) {
	$('#qrcode').html('')
	var tid = $(item).attr("tid");
	var url = window.location.href.replace(window.location.pathname, "") + "/prize_exchange/" + tid + "/";
	alert(url);
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