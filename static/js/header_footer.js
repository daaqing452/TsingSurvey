$(document).ready(function(){
	var uid = $('div#header').attr('uid');
	$('div#header').append('\
		<a href=\'/logout/\'> 登出 </a> <br/>\
		<a href=\'/index/\'> 首页 </a> <br/>\
		<a href=\'/profile/\' + uid + '\'> 个人页面 </a> <br/>\
	');
});