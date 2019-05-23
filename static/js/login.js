$(document).ready(function(){
	if(IsPC()==false){
		$('body').prop("background", "{% static 'img/background2.jpg' %}");
	}
});

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function checkAndSubmit() {
    var username = $('#username').val();
    var password = $('#password').val();
    //password = hex_md5(password);
    password = uglyEncrypt(password);
    $('#password').val(password);
    return true;
}