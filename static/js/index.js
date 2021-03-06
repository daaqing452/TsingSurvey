$(document).ready(function(){
	$('#survey_create').click(function(){
		$.ajax({
			url: '/survey/00000/',
			type: 'POST',
			data: {'op': 'create'},
			success: function(data) {
				data = JSON.parse(data);
				window.location.href = '/survey/' + data['qid'] + '/'
			}
		});
	});
});

function delete_questionaire(obj) {
	if (confirm('确认删除？')) {
		var td = $(obj);
		var qid = td.attr('qid');
		$.ajax({
			url: '/survey/' + qid + '/',
			type: 'POST',
			data: {'op': 'delete'},
			success: function(data) {
				data = JSON.parse(data);
				td.parent().parent().remove();
			}
		});
	}
}

function copy_questionaire(obj) {
	var td = $(obj);
	var qid = td.attr('qid');
	$.ajax({
		url: '/survey/' + qid + '/',
		type: 'POST',
		data: {'op': 'copy'},
		success: function(data) {
			data = JSON.parse(data);
			window.location.reload();
		}
	});
}

function export_index(obj) {
	var td = $(obj);
	var qid = td.attr('qid');
	$.ajax({
		url: '/survey/' + qid + '/',
		type: 'POST',
		data: {'op': 'export'},
		success: function(data) {
			data = JSON.parse(data);
			if (data['result'] == 'no') {
				alert(data['info']);
				return;
			}
			export_path = '/' + data['export_path'];
			$('a#' + qid + 'download').attr('href', export_path);
			document.getElementById(qid + "download").click();
		}
	});
}

function export_all_index(obj) {
	var td = $(obj);
	var qid = td.attr('qid');
	$.ajax({
		url: '/survey/' + qid + '/',
		type: 'POST',
		data: {'op': 'export_all'},
		success: function(data) {
			data = JSON.parse(data);
			if (data['result'] == 'no') {
				alert(data['info']);
				return;
			}
			export_path = '/' + data['export_path'];
			$('a#' + qid + 'download').attr('href', export_path);
			document.getElementById(qid + "download").click();
		}
	});
}
