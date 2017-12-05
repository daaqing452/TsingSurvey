$(document).ready(function(){
	var url = window.location.href.replace(window.location.pathname, "");
	$("#qrcode").attr("href", "https://cli.im/api/qrcode/code?text=" + url);
});;