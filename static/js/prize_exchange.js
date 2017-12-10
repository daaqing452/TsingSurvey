$(document).ready(function(){

});

function exchange() {
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {"op": "exchange"},
		success: function(data) {
			var data = JSON.parse(data);
			$("#confirm").hide();
			$("#wait").show();
			$("#success").hide();
			window.setInterval(function(){ 
				$.ajax({
					url: window.location.href,
					type: "POST",
					data: {"op": "if_confirm"},
					success: function(data) {
						var data = JSON.parse(data);
						if (data['result'] == "confirmed") {
							$("#confirm").hide();
							$("#wait").hide();
							$("#success").show();
						} else {
							console.log("waiting...");
						}
					}
				})
			}, 1000);
		}
	})
}