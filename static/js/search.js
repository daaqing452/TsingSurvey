$(document).ready(function(){

	$('button#search').click(function() {
		var keyword = $('input#keyword').val();
		if (keyword == '') return;
		$.ajax({
			url: window.location.pathname,
			type: 'POST',
			data: {'op': 'search', 'keyword': keyword},
			success: function(data) {
				data = JSON.parse(data);
				var result = data['result'];
				var tbody = $('table#result').children('tbody');
				$('[type="item"]').remove();
				$('[type="empty"]').hide();
				if (result.length == 0) {
					$('[type="empty"]').show();
					return;
				}
				for (var i in result) {
					var d = result[i];
					var tr = $('[type="clone"]').first().clone();
					tr.attr('type', 'item');
					tr.find('[type="qid"]').text(d['id']);
					tr.find('[type="title"]').text(d['title']);
					tr.find('[type="title"]').attr('href', '/survey/' + d['id'] + '/');
					tr.find('[type="update_time"]').text(d['update_time']);
					tr.find('[type="context_left"]').text(d['context_left']);
					tr.find('[type="context_mid"]').text(d['context_mid']);
					tr.find('[type="context_right"]').text(d['context_right']);
					tr.show();
					tbody.append(tr);
				}
			}
		});
	});

});