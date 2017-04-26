$(document).ready(function(){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			data = JSON.parse(data);
			situation = data['status'];
			title = data['title'];
			qstring = data['qstring'];
			now_time = new Date();
			load_time_format = gettimeformat(now_time);
			load_time = now_time.getTime();
			$('input#title').val(title);
			$('p#title').html(title);
			if(qstring == ""){
				return;
			}
			if(situation == 0){
				questions = JSON.parse(qstring);
				createPage();
				getindex();
			}
			if(situation == 1){
				//定时保存
				window.setInterval(function(){ 
					tempSave(); 
				}, 10000); 
				questions = JSON.parse(qstring);
				answers_from_database = JSON.parse(data['astring']);
				showPage();
				getindex();
				fillAnswer();
			}
			if(situation == 2){
				results = JSON.parse(qstring);
				showReport();
				//alert(questions[0].s_type);
				//showPage();
				//getindex();
			}
		}
	});
});

function prefixzero(num){
	if(Number(num) < 10){
		return "0" + num.toString();
	}
	else{
		return num.toString();
	}
}

function gettimeformat(now_t) {
	var year = prefixzero(now_t.getFullYear().toString());
	var month = prefixzero((now_t.getMonth()+1).toString());
	var day = prefixzero(now_t.getDate().toString());
	var hour = prefixzero(now_t.getHours().toString());
	var minute = prefixzero(now_t.getMinutes().toString());
	var second = prefixzero(now_t.getSeconds().toString());
	var t_format = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	return t_format;
}

function exportt() {
	var qid = $('p#qid').attr('qid');
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'export'},
		success: function(data) {
			data = JSON.parse(data);
			export_path = '/' + data['export_path'];
			$('a#download').attr('href', export_path);
			document.getElementById("download").click();
		}
	});
}