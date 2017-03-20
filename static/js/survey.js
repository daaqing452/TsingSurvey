$(document).ready(function(){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'load'},
		success: function(data) {
			data = JSON.parse(data);
			status = data['status'];
			title = data['title'];
			qstring = data['qstring'];
			load_time = new Date().getTime();
			$('input#title').val(title);
			$('p#title').html(title);
			if(qstring == ""){
				return;
			}
			if(status == 0){
				questions = JSON.parse(qstring);
				createPage();
				getindex();
			}
			if(status == 1){
				questions = JSON.parse(qstring);
				showPage();
				getindex();
			}
			if(status == 2){
				questions = JSON.parse(qstring);
				showPage();
				getindex();
			}
		}
	});
});

function analysis() {
	var qid = $('p#qid').attr('qid');
	$.ajax({
		url: '/analysis/',
		type: 'POST',
		data: {'op': 'analysis', 'qid': qid},
		success: function(data) {
			data = JSON.parse(data);
			alert('生成报告成功！');
			window.location.reload();
		}
	});
}

function exportt() {
	var qid = $('p#qid').attr('qid');
	$.ajax({
		url: '/analysis/',
		type: 'POST',
		data: {'op': 'export', 'qid': qid},
		success: function(data) {
			data = JSON.parse(data);
			export_path = '/' + data['export_path'];
			$('a#download').attr('href', export_path);
			document.getElementById("download").click();
		}
	});
}