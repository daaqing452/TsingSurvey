$(document).ready(function(){
	
});

function deletee(p) {
	var pid = $(p).attr("pid");
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