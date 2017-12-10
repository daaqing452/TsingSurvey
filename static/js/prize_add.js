$(document).ready(function(){
	
});

function add_prize() {
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {"op": "add_prize", "title": $("#title").val(), "description": $("#description").val(), "credit": $("#credit").val(), "price": $("#price").val(), "expire_time": $("#expire_time").val()},
		success: function(data) {
			var data = JSON.parse(data);
			window.location.href = "/prize/";
		}
	});
}