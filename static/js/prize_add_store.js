$(document).ready(function(){
	
});

function add_store() {
	var pid_list = new Array();
	$("input[name='item']:checkbox:checked").each(function() {
		pid_list.push($(this).attr("pid"));
	});
	$.ajax({
		url: window.location.href,
		type: "POST",
		data: {"op": "add_store", "username": $("#username").val(), "nickname": $("#nickname").val(), "password": $("#password").val(), "pid_list": JSON.stringify(pid_list)},
		success: function(data) {
			var data = JSON.parse(data);
			var result = data["result"];
			if (result == "ok") {
				alert("添加成功");
				window.location.href = "/prize/";
			} else {
				alert(result);
			}
		}
	});
}