$(document).ready(function(){

});

function exchange(item) {
	$('#qrcode').html('')
	var tid = $(item).attr("tid");
	var url = window.location.href.replace(window.location.pathname, "") + "/prize_exchange/" + tid + "/";
	$('#qrcode').qrcode(url);
}