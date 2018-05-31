$(document).ready(function(){
	var img = $('img#head');
	//img.attr('src', '/static/head/' + img.attr('puid') + '.jpg');
	img.attr('src', '/static/head/38.jpg');
});

function change_nickname(node) {
	var uid = $(node).attr("uid");
	var span = $(node).parent().find("span#nickname");
	var new_nickname = prompt('新的昵称', '');
	if (new_nickname == null) new_nickname = span.html();
	if (new_nickname == '') new_nickname = span.html();
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_nickname', 'nickname': new_nickname},
		success: function(data) {
			var data = JSON.parse(data);
			span.html(new_nickname);
		}
	});
}

function change_password() {
	var old_password = $("#old_password").val();
	var new_password = $("#new_password").val();
	var new_password_2 = $("#new_password_2").val();

	if (new_password != new_password_2) {
		$("#info").text("两次输入的新密码不相同！");
		return;
	}
	if (new_password == '') {
		$("#info").text("新密码不能为空！");
		return;
	}

	old_password = hex_md5(old_password);
	new_password = hex_md5(new_password);

	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'change_password', 'old_password': old_password, 'new_password': new_password},
		success: function(data) {
			var data = JSON.parse(data);
			var result = data['result'];
			if (result == 'yes') {
				alert('密码修改成功！');
				$("#myModal").modal("hide");
			} else {
				$("#info").text("原密码错误！");
			}
		}
	});
}