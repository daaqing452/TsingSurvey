var wrong_info = "";
var load_time_format = 0;
var load_time = 0
var submit_time = 0;
var submit_time_format = 0;
function createSurveyHtml(q){
	var index = q.index;
	if(q.s_type != 8){
		var HTMLContent = "<td id=\"Q_"+(index + 1).toString()+"\" jump_to=\""+q.jump_to+"\">";
	}
	if(q.s_type == 8){
		var HTMLContent = "<td>";
	}
	if(q.s_type == 7){
		HTMLContent += "<div><font class=\"h3\">"+(index + 1).toString()+ ".</font>";
		for(var i = 0; i < q.n_option; i++){
			var option = q.options[i];
			HTMLContent += option.text+"&nbsp<input type=\"text\" name=\"single\">&nbsp&nbsp";
		}
	}
	else if(q.s_type == 8){
		HTMLContent += "<div class=\"h3\">"+q.title_html;
	}
	else{
		HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title_html;
	}
	if(q.s_type == 2){
		var flag = 0;
		var HTMLtemp = "";
		if(q.min_select != ""){
			HTMLtemp += "至少选" + q.min_select+"项"; 
			flag = 1;
		}
		if(q.max_select != ""){
			if(flag == 1){
				HTMLtemp += ",";
			}
			HTMLtemp += "至多选" + q.max_select+"项";
			flag = 2;
		}
		if(flag != 0){
			HTMLContent+="("+HTMLtemp+")";
		}
	}
	if(q.jump_to != false){
		HTMLContent += "(填写此题后将跳转到第"+q.jump_to+"题)"; 
	}
	if(q.must_answer == true){
		HTMLContent += "*";
	}
	HTMLContent += "</div>";
	switch(q.s_type){
		case 1:{
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+String.fromCharCode(i + 65)+". ";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += "<img src=\"" + option.image + "\" width=\"20%\">";
				}
				if(option.allow_filled == true){
					HTMLContent += "<input type=\"text\"></p>";
				}
				else{
					HTMLContent += "</p>";
				}
			}
			HTMLContent += "</form></div>";
			break;
		}
		case 2:{
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+String.fromCharCode(i + 65)+". ";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += "<img src=\"" + option.image + "\">";
				}
				if(option.allow_filled == true){
					HTMLContent += "<input type=\"text\"></p>";
				}
				else{
					HTMLContent += "</p>";
				}
			}
			HTMLContent += "</form></div>";
			break;
		}
		case 3:{
			HTMLContent += "<form>";
			HTMLContent += "<p class=\"q_item\"><input type=\"text\"></p>";
			HTMLContent += "</form></div>";
			break;
		}
		case 4:{
			HTMLContent += "<div><select><option value = \"\">--请选择--</option>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<option value=\""+i.toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\">"+option.text+"</option>";
			}
			HTMLContent += "</select></div>";
			break;
		}
		case 5:{
			HTMLContent += "<ul style=\"float:left;margin:0px;padding:0px;\">";
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				HTMLContent += "<li><input type=\"checkbox\" value=\""+i.toString()+"\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" onclick=\"addToSort(this)\">"+option.text+"</li>";
			}
			HTMLContent += "</ul>";
			var sort_table = "<table><tbody>"+
			"<tr><td><div style=\"margin-left:10px\"><select size=\"6\" style=\'width:200px;background:#ffffff;overflow:auto;height:120px;\'></select></div></td>"+
			"<td><ul><li><button class=\"btn btn-warning btn-sm\" onclick=\"sort(this)\">移至最前</li>"+
			"<li><button class=\"btn btn-success btn-sm\" onclick=\"sort(this)\">上移一位</li>"+
			"<li><button class=\"btn btn-success btn-sm\" onclick=\"sort(this)\">下移一位</li>"+
			"<li><button class=\"btn btn-warning btn-sm\" onclick=\"sort(this)\">移至最后</li>"+
			"</ul></td></tr></tbody></table>";
			HTMLContent += sort_table;
			break;
		}
		case 6:{
			HTMLContent += "<table class=\"table \"><tbody><tr><td></td>";
			var n_col = q.n_option / q.n_set;
			var n_row = q.n_set;
			for(var i = 0; i < n_col; i++){
				HTMLContent += "<td>" + q.options[i].image + "</td>";
			}
			HTMLContent += "</tr>";
			for(var i = 0; i < n_row; i++){
				HTMLContent += "<tr><td>" + q.options[i*n_col].text +"</td>";
				for(var j = 0; j < n_col; j++){
					HTMLContent += "<td><input type=\"radio\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"_"+(i+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i*n_col+j+1).toString() +"\"></td>";
				}
				HTMLContent += "</tr>";
			}
			HTMLContent += "</tbody></table>";
			break;
		}
	}
	HTMLContent += "</td>";
	return HTMLContent;

}

function showBase(b){
	var $b = $(b);
	var id_str = $b.prop("id");
	var name_group = $b.prop("name");
	var is_selected = $b.prop("checked");
	var jump_to = $b.parents("td").attr("jump_to");
	var tr_index = $b.parents("tr").index();   //从0开始，行号
	//跳转题目展示变化
	if($b.prop("type") == "radio"){
		for(var line_id = tr_index+2; line_id < jump_to; line_id++){
			$('#Q_'+line_id.toString()).parent().hide();
		}
	}
	if($b.prop("type") == "checkbox"){
		if(is_selected){
			for(var line_id = tr_index+2; line_id < jump_to; line_id++){
				$('#Q_'+line_id.toString()).parent().hide();
			}
		}
		else{
			var check_num = $("input[name=\""+name_group+"\"]").length;
			var flag = false;
			for(var i = 0; i < check_num; i++){
				var check_is_selected = $("input[name=\""+name_group+"\"]").eq(i).prop("checked");
				if(check_is_selected){
					flag = true;
					break;
				}
			}
			if(flag){
				for(var line_id = tr_index+2; line_id < jump_to; line_id++){
					$('#Q_'+line_id.toString()).parent().hide();
				}
			}
			else{
				for(var line_id = tr_index+2; line_id < jump_to; line_id++){
					$('#Q_'+line_id.toString()).parent().show();
				}
			}
		}
	}
	//依赖题目展示变化
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
		if(q.jump_from != false){
			var jump_from_q = "Q_" + q.jump_from[0] + "_" + q.jump_from[1];
			if(jump_from_q == id_str){
				if(is_selected){
					$('#Q_'+(q.index + 1).toString()).parent().show();
				}
				else{
					$('#Q_'+(q.index + 1).toString()).parent().hide();
				}
			}
		}
	}
	if($b.prop("type") == "radio"){
		var radio_num = $("input[name=\""+name_group+"\"]").length;
		for(var i = 0; i < radio_num; i++){
			var radio_id_str = $("input[name=\""+name_group+"\"]").eq(i).prop("id");
			var radio_is_selected = $("input[name=\""+name_group+"\"]").eq(i).prop("checked");
			for(var j = 0; j < questions.length; j++){
				var q = questions[j];
				if(q.jump_from != false){
					var jump_from_q = "Q_" + q.jump_from[0] + "_" + q.jump_from[1];
					if(jump_from_q == radio_id_str){
						if(radio_is_selected){
							$('#Q_'+(q.index + 1).toString()).parent().show();
						}
						else{
							$('#Q_'+(q.index + 1).toString()).parent().hide();
						}
					}
				}
			}
		}
	}
}

function showPage(){
	for(var i = 0; i < questions.length; i++){
		var new_row = q_table.insertRow(-1);
		var q = questions[i];
		var new_html = createSurveyHtml(q);
		new_row.innerHTML = new_html;
		if(q.jump_from != false){
			$('#Q_'+(q.index + 1).toString()).parent().hide();
		}
	}
}

function verify(a){
	if(a.must_answer == true & a.select.length < a.n_set & a.show){
		wrong_info += "第"+(a.index+1)+"题为必答题!\n";
		return false;
	}
	if(a.s_type == 2 & (a.select.length < a.min_select || a.select.length > a.max_select)){
		wrong_info += "第"+(a.index+1)+"题选择选项数量有误!\n";
		return false;
	}
	return true;
}

function addToSort(b){
	var $b = $(b);
	var id_str = $b.prop("id");
	var option_index = $b.prop("value");
	var is_selected = $('#'+id_str).get(0).checked;
	var text = $('#'+id_str).parent().text();
	if(is_selected){
		//在select中加入该option
		$('#'+id_str).parent().parent().parent().find('select').append("<option value=\"" + option_index + "\" >" + text + "</option>");
	}
	else{
		//在select中删除该option
		$('#'+id_str).parent().parent().parent().find("select option[value=\"" + option_index + "\"]").remove();
	}
}

function sort(b){
	var $b = $(b);
	//0-移至最前 1-上移一位 2-下移一位 3-移至最后
	var op_index = $b.parent().index();
	var $select = $b.parent().parent().parent().parent().find("select");
	var select_option_val = $select.val();
	if(select_option_val == null){
		return;
	}
	var select_text = $select.find("option:selected").text();
	var select_index = $select.get(0).selectedIndex; // 被选择的待排序结果在列表中位置
	var max_index = $select.find("option:last").index(); //从0开始
	switch(op_index){
		case 0:{
			$select.find("option[value=\"" + select_option_val + "\"]").remove();
			$select.prepend("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			break;
		}
		case 1:{
			if(select_index == 0){
				$select.find("option[value=\"" + select_option_val + "\"]").remove();
				$select.append("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			}
			else{
				var former_val = $select.find("option").eq(select_index-1).val();
				$select.find("option[value=\"" + select_option_val + "\"]").remove();
				$select.find("option[value=\"" + former_val + "\"]").before("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			}
			break;
		}
		case 2:{
			if(select_index == max_index){
				$select.find("option[value=\"" + select_option_val + "\"]").remove();
				$select.prepend("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			}
			else{
				var latter_val = $select.find("option").eq(select_index+1).val();
				$select.find("option[value=\"" + select_option_val + "\"]").remove();
				$select.find("option[value=\"" + latter_val + "\"]").after("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			}
			break;
		}
		case 3:{
			$select.find("option[value=\"" + select_option_val + "\"]").remove();
			$select.append("<option value=\"" + select_option_val + "\" >" + select_text + "</option>");
			break;
		}

	}
	

}

function submit(){
	var answers = new Array();
	wrong_info = "[填写错误信息]\n";
	var legal = true;
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
		var a = {s_type:q.s_type};
		a.index = q.index;
		a.title = q.title;
		a.select = [];   //[index,type(0-text,1-image,2-text&image for matrix),text,image]
		a.must_answer = q.must_answer;
		switch(q.s_type){
			case 1:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = 1;
				var n_option = q.n_option;
				for(var j = 0; j < n_option; j++){
					var id_str = "Q_" + (i+1).toString() + "_" + (j+1).toString();
					var is_selected = $('#'+id_str).get(0).checked;
					if(is_selected){
						var allow_filled = q.options[j].allow_filled;
						var option_type = q.options[j].option_type;
						if(option_type == 1){
							a.select.push([j,1,"",q.options[j].image]);
						}
						else{
							if(allow_filled){
								a.select.push([j,0,$('#'+id_str).parent().children("input[type='text']").prop("value"),""]);
							}
							else{
								a.select.push([j,0,q.options[j].text,"",]);
							}
						}
						break;
					}
				}
				break;
			}
			case 2:{
				a.min_select = q.min_select;
				a.max_select = q.max_select;
				a.n_set = 1;
				var n_option = q.n_option;
				for(var j = 0; j < n_option; j++){
					var id_str = "Q_" + (i+1).toString() + "_" + (j+1).toString();
					var is_selected = $('#'+id_str).get(0).checked;
					if(is_selected){
						var allow_filled = q.options[j].allow_filled;
						var option_type = q.options[j].option_type;
						if(option_type == 1){
							a.select.push([j,1,"",q.options[j].image]);
						}
						else{
							if(allow_filled){
								a.select.push([j,0,$('#'+id_str).parent().children("input[type='text']").prop("value"),""]);
							}
							else{
								a.select.push([j,0,q.options[j].text,""]);
							}
						}
					}
				}
				break;
			}
			case 3:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = 1;
				var id_str = "Q_" + (i + 1);
				var text = $('#'+id_str).find("input[type='text']").prop("value");
				if(text != ""){
					a.select.push([0,0,text,""]);
				}
				break;
			}
			case 4:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = 1;
				var id_str = "Q_" + (i + 1);
				var select_option_val = $('#'+id_str).find("select").val();
				var select_option_text = $('#'+id_str).find("option:selected").text();
				if(select_option_val != ""){
					a.select.push([select_option_val,0,select_option_text,""]);
				}
				break;
			}
			case 5:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = 1;
				var id_str = "Q_" + (i + 1);
				var $select = $('#'+id_str).find("select");
				var max_index = $select.find("option:last").index(); 
				if(max_index != -1){
					for(var j = 0; j <= max_index; j++){
						var val = $select.find("option").eq(j).val();
						var text = $select.find("option").eq(j).text();
						a.select.push([val,0,text,""]);
					}
				}
				break;
			}
			case 6:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = q.n_set;
				var n_option = q.n_option;
				for(var j = 0; j < n_option; j++){
					var id_str = "Q_" + (i+1).toString() + "_" + (j+1).toString();
					var is_selected = $('#'+id_str).get(0).checked;
					if(is_selected){
						a.select.push([j,2,q.options[j].text,q.options[j].image]);
					}
				}
				break;
			}
			case 7:{
				a.min_select = -1;
				a.max_select = -1;
				a.n_set = q.n_option;
				var n_option = q.n_option;
				var id_str = "Q_" + (i + 1);
				for(var j = 0; j < n_option; j++){
					var text = $("#"+id_str).find("input[type=\"text\"]").eq(j).val();
					if(text != ""){
						a.select.push([j,0,text,""]);
					}
				}
				break;
			}
			case 8:{
				break;
			}
		}

		a.show = true;
		if($("#Q_"+(i+1).toString()).parents("tr").is(":hidden")){
			a.show = false;
		}
		if(verify(a)){
			answers.push(a);
		}
		else{
			legal = false;
		}
	}

	if(legal){
		var Astring = JSON.stringify(answers);
		now_time = new Date();
		submit_time = now_time.getTime();
		submit_time_format = gettimeformat(now_time);
		var dwell_time = submit_time - load_time;
		if (confirm('确认提交问卷？')) {
			$.ajax({
				url: window.location.href,
				type: 'POST',
				data: {'op': 'submit', 'astring': Astring, 'load_time': load_time_format,'submit_time':submit_time_format},
				success: function(data) {
					data = JSON.parse(data);
					alert('提交成功');
					$('input#credit').val(data['credit']);
					$('form#goto_bonus').submit();
				}
			});
		}
	}
	else{
		alert(wrong_info);
		return;
	}
}


function closeup() {
	if (confirm('确认关闭问卷？')) {
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'closeup'},
			success: function(data) {
				data = JSON.parse(data);
				alert('关闭成功！');
				window.location.reload()
			}
		});
	}
}
