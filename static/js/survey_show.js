var wrong_info = ""
function createSurveyHtml(q){
	var index = q.index;
	var HTMLContent = "<td id=\"Q_"+(index + 1).toString()+"\">";
	HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title;
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
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+String.fromCharCode(i + 65)+". ";
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
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+String.fromCharCode(i + 65)+". ";
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
				HTMLContent += "<li><input type=\"checkbox\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" onclick=\"addsort(this)\">"+option.text+"</li>";
			}
			HTMLContent += "</ul>";
			var sort_table = "<table><tbody>"+
			"<tr><td><div style=\"margin-left:10px\"><select size=\"6\" style=\'width:200px;background:#ffffff;overflow:auto;height:120px;\'></select></div></td>"+
			"<td><ul><li><button class=\"btn btn-warning btn-sm\" onclick=\"sort(1)\">移至最前</li>"+
			"<li><button class=\"btn btn-success btn-sm\" onclick=\"sort(2)\">上移一位</li>"+
			"<li><button class=\"btn btn-success btn-sm\" onclick=\"sort(3)\">下移一位</li>"+
			"<li><button class=\"btn btn-warning btn-sm\" onclick=\"sort(4)\">移至最后</li>"+
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
					HTMLContent += "<td><input type=\"radio\" name=\"Q_"+(index+1).toString()+"_"+(i+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i*n_col+j+1).toString() +"\"></td>";
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



function showPage(){
	for(var i = 0; i < questions.length; i++){
		var new_row = q_table.insertRow(-1);
		new_row.innerHTML = createSurveyHtml(questions[i]);
	}
}

function verify(a){
	if(a.must_answer == true & a.select.length < a.n_set){
		wrong_info += "第"+(a.index+1)+"题为必答题!\n";
		return false;
	}
	if(a.s_type == 2 & (a.select.length < a.min_select || a.select.length > a.max_select)){
		wrong_info += "第"+(a.index+1)+"题选择选项数量有误!\n";
		return false;
	}
	return true;
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
				/*
				legal = verify(a);
				if(legal){
					answers.push(a);
				}
				*/
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
				/*
				legal = verify(a);
				if(legal){
					answers.push(a);
				}
				*/
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
				/*
				legal = verify(a);
				if(legal){
					answers.push(a);
				}
				*/
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
				/*
				legal = verify(a);
				if(legal){
					answers.push(a);
				}
				*/
				break;
			}
			case 5:{
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
				legal = verify(a);
				if(legal){
					answers.push(a);
				}
				break;
			}
		}
	}
	if(legal){
		var Astring = JSON.stringify(answers);
		alert(Astring);
	}
	else{
		alert(wrong_info);
		return;
	}
}

function submit_backup(){
	for(var i = 0; i < questions2.length; i++){
		var q = questions2[i];
		var a = {s_type:q.s_type};
		a.title = q.title;
		if(q.s_type == 1 || q.s_type == 2){
			a.select = [];
			var n_option = q.n_option;
			for(var j =0; j < n_option; j++){
				var id_str = "Q_" + i.toString() + "_" + j.toString();
				var is_selected = $('#'+id_str).get(0).checked;
				if(is_selected == true){
					a.select.push(j);
				}
			}
		}
		if(q.s_type == 3){
			var id_str = "Q_" + i.toString() + "_0";
			a.text = $('#'+id_str).get(0).value;
		}
		answers.push(a);
	}
	//put Astring into database
	var Astring = JSON.stringify(answers);
	
	if (confirm('Do you confirm to submit?')) {
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'submit', 'astring': Astring, 'credit': 10},
			success: function(data) {
				data = JSON.parse(data);
				alert('Submit succesful');
				window.location.href = '/bonus/';
			}
		});
	}
	
}

function closeup() {
	if (confirm('Do you comfirm to close?')) {
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'closeup'},
			success: function(data) {
				data = JSON.parse(data);
				alert('Close successful');
				window.location.reload()
			}
		});
	}
}
