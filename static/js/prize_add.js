$(document).ready(function(){
	
});

function add_prize() {
	var num_pat = new RegExp("^[1-9][0-9]*$");
	var data_pat = new RegExp("^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$");
	wrong_messages = new Array();
	if(num_pat.test($("#credit").val()) == false){
		wrong_messages.push("兑换积分需填写数字");
	}
	if(num_pat.test($("#price").val()) == false){
		wrong_messages.push("金额需填写数字");
	}
	if(data_pat.test($("#expire_time").val()) == false){
		wrong_messages.push("截止日期格式有误(正确:XXXX-XX-XX)");
	}
	if(wrong_messages.length != 0){
		wrong_messages_br = "";
		for(var i = 0; i < wrong_messages.length; i++){
			wrong_messages_br += wrong_messages[i]+"\n";
		}
		alert(wrong_messages_br);
		return;
	}
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