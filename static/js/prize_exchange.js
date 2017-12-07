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
			
		}
	})
}