$(document).ready(function(){

});

function exchange(item) {
	var url = window.location.href.replace(window.location.pathname, "");
	var tid = $(item).attr("tid");
	window.location.href = "https://cli.im/api/qrcode/code?text=" + url + "/prize_exchange/" + tid + "/";
}