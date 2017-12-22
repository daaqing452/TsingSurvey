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