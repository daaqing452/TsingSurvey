var wrong_info = "";
var load_time_format = 0;
var load_time = 0
var submit_time = 0;
var submit_time_format = 0;
var temp = 0;
var answers = new Array();
var answers_from_database = new Array();
var report_status = {s_type: 0, index: 0};
var report_title_html = "<tr><td><h3>题目标题</h3></td></tr><tr><td><textarea style=\"width: 100%; height: 50px; overflow: auto; resize: none;\" name=\"res_title\"></textarea></td></tr>"
var report_content;

var bianji_list = new Array("huodongneirong_bianji_0");
var huodongneirong_html = '<td align=\"center\" style=\"vertical-align: middle;\">活动内容</td> <td colspan=\"3\"><textarea  style=\"width: 100%; height: 100px; overflow: auto; resize: none;\"></textarea></td>';

var options = {  
resizeType : 1,
filterMode : true,  
allowImageUpload : false,  
allowFlashUpload : false,  
allowMediaUpload : false,  
allowFileManager : false,  
afterBlur: function(){this.sync();},
items : ['fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',  
'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',  
'insertunorderedlist'],  
}; 

var options_2 = {  
resizeType : 1,
filterMode : true,  
allowPreviewEmoticons : false,
allowImageRemote : false,
useContextmenu : false, 
uploadJson : '/uploadFile/', 
afterBlur: function(){this.sync();},
items : ['fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',  
'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',  
'insertunorderedlist', '|', 'emoticons', 'image'],  
}; 

var editor_title;
var editor = new Array();  


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

function createSurveyHtml(q){
	var index = q.index;
	if(q.s_type != 8){
		var HTMLContent = "<td id=\"Q_"+(index + 1).toString()+"\" jump_to=\""+q.jump_to+"\">";
	}
	if(q.s_type == 8){
		var HTMLContent = "<td>";
	}
	if(q.s_type == 8){
		HTMLContent += "<div><font size=\"3\">"+ q.title_html;
	}
	else{
		HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html;
	}
	if(q.s_type == 2 || q.s_type == 5){
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
	if((q.must_answer == true && q.s_type != 7) || (q.must_answer == true && q.s_type == 7 && q.title.replace(" ", "").length != 0)){
		HTMLContent += "*";
	}

	if(q.s_type == 7 && q.title.replace(" ", "").length == 0){
		HTMLContent += "</font>";
	}
	else{
		HTMLContent += "</font></div>";
	}
	switch(q.s_type){
		case 1:{
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+option.index+". ";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += "<img src=\"" + option.image + "\" width=\"20%\">";
				}
				if(option.allow_filled == true){
					HTMLContent += "<input type=\"text\" style=\"width:50px\"></p>";
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
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i+1).toString() +"\" > "+option.index+". ";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += "<img src=\"" + option.image + "\">";
				}
				if(option.allow_filled == true){
					HTMLContent += "<input type=\"text\" style=\"width:50px\"></p>";
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
			HTMLContent += "<p class=\"q_item\"><input type=\"text\" style=\"width:50px\"></p>";
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
			if(IsPC()){
				HTMLContent += "<table class=\"table \" style=\"table-layout:fixed;word-break:break-all\"><tbody><tr class=\"info\"><td></td>";
				var n_col = q.n_option / q.n_set;
				var n_row = q.n_set;
				for(var i = 0; i < n_col; i++){
					HTMLContent += "<td align=\"center\">" + q.options[i].image + "</td>";
				}
				HTMLContent += "</tr>";
				for(var i = 0; i < n_row; i++){
					HTMLContent += "<tr><td>" + q.options[i*n_col].text +"</td>";
					for(var j = 0; j < n_col; j++){
						HTMLContent += "<td align=\"center\"><input type=\"radio\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"_"+(i+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i*n_col+j+1).toString() +"\"></td>";
					}
					HTMLContent += "</tr>";
				}
				HTMLContent += "</tbody></table>";
			}
			else{
				HTMLContent += "<table class=\"table \" style=\"table-layout:fixed;word-break:break-all\"><tbody><tr class=\"info\">";
				var n_col = q.n_option / q.n_set;
				var n_row = q.n_set;
				for(var i = 0; i < n_col; i++){
					HTMLContent += "<td align=\"center\">" + q.options[i].image + "</td>";
				}
				HTMLContent += "</tr>";
				var row_cnt = 0
				for(var i = 0; i < n_row; i++){
					row_cnt += 1;
					if(row_cnt == 6){
						HTMLContent += "<tr class=\"info\">";
						for(var col_j = 0; col_j < n_col; col_j++){
							HTMLContent += "<td align=\"center\">" + q.options[col_j].image + "</td>";
						}
						HTMLContent += "<tr>";
						row_cnt = 1;
					}
					HTMLContent += "<tr><td colspan=\""+n_col+"\">" + q.options[i*n_col].text +"</td><tr>";
					HTMLContent += "<tr>";
					for(var j = 0; j < n_col; j++){
						HTMLContent += "<td align=\"center\"><input type=\"radio\" onclick = \"showBase(this)\" name=\"Q_"+(index+1).toString()+"_"+(i+1).toString()+"\" id=\"Q_"+(index+1).toString()+"_"+(i*n_col+j+1).toString() +"\"></td>";
					}
					HTMLContent += "</tr>";
				}
				HTMLContent += "</tbody></table>";
			}
			break;
		}
		case 7:{
			if(IsPC()){
				for(var i = 0; i < q.n_option; i++){
					var option = q.options[i];
					if(i != 0 & i % 3 ==0){
						HTMLContent += "<br>";
					}
					HTMLContent += option.text+"&nbsp<input type=\"text\" name=\"single\" style=\"width:50px\">&nbsp&nbsp";
				}
			}
			else{
				for(var i = 0; i < q.n_option; i++){
					var option = q.options[i];
					HTMLContent += option.text+"&nbsp<input type=\"text\" name=\"single\" style=\"width:50px\"><br>";
				}
			}

			if(q.must_answer == true && q.title.replace(" ", "").length == 0){
				HTMLContent += "*<br>";
			}
			else{
				HTMLContent += "<br>";
			}
			break;
		}
	}
	HTMLContent += "<br></td>";
	return HTMLContent;

}



function tempSave(){
	var save_time = new Date();
	var save_time_format = gettimeformat(save_time); 
	
	submit(1);
} 

function fill(answer){
	switch(answer.s_type){
		case 1:{
			var select = answer.select;
			if(select.length != 0){
				for(var i = 0; i < select.length; i++){
					var a_index = select[i][0];
					var id_str = "Q_" + (answer.index+1).toString() + "_" + (a_index+1).toString();
					$('#'+id_str).get(0).checked = true;
				}
			}
			break;
		}
		case 2:{
			var select = answer.select;
			if(select.length != 0){
				for(var i = 0; i < select.length; i++){
					var a_index = select[i][0];
					var id_str = "Q_" + (answer.index+1).toString() + "_" + (a_index+1).toString();
					$('#'+id_str).get(0).checked = true;
				}
			}
			break;
		}
		case 3:{
			var select = answer.select;
			if(select.length != 0){
				var id_str = "Q_" + (answer.index + 1);
				var a_text = select[0][2];
				$('#'+id_str).find("input[type='text']").attr("value",a_text);
			}
			
			break;
		}
		case 4:{
			var select = answer.select;
			if(select.length != 0){
				var id_str = "Q_" + (answer.index + 1);
				var a_val = select[0][0];
				$('#'+id_str).find("select").val(a_val);
			}
			break;
		}
		case 5:{
			var select = answer.select;
			if(select.length != 0){
				var id_str = "Q_" + (answer.index + 1);
				var $select = $('#'+id_str).find("select");
				for(var i = 0; i < select.length; i++){
					var a_val = select[i][0];
					var a_text = select[i][2];
					$select.append("<option value=\"" + a_val + "\">" +a_text +"</option>");
					var a_id_str = "Q_" + (answer.index + 1) + "_" + (Number(a_val)+1);
					$('#'+a_id_str).get(0).checked = true;
				}
			}
			break;
		}
		case 6:{
			var select = answer.select;
			if(select.length != 0){
				for(var i = 0; i < select.length; i++){
					var a_index = select[i][0];
					var id_str = "Q_" + (answer.index+1).toString() + "_" + (a_index+1).toString();
					$('#'+id_str).get(0).checked = true;
				}
			}
			break;
		}
		case 7:{
			var select = answer.select;
			if(select.length != 0){
				var id_str = "Q_" + (answer.index + 1);
				for(var i = 0; i < select.length; i ++){
					var a_index = select[i][0];
					var a_text = select[i][2];
					$("#"+id_str).find("input[type=\"text\"]").eq(a_index).attr("value",a_text);
				}
			}
			break;
		}
	}
}

function fillAnswer(){
	for(var i = 0; i < answers_from_database.length; i++){
		var answer = answers_from_database[i];
		fill(answer);
	}
}

function showBase(b){
	var $b = $(b);
	var id_str = $b.prop("id");
	var name_group = $b.prop("name");
	var is_selected = $b.prop("checked");
	var jump_to = $b.parents("td").attr("jump_to");
	var tr_index = $b.parents("tr").index();   //从0开始，行号
	//跳转题目展示变化
	if($b.prop("type") == "checkbox"){
		var option_length = 0;
		var check_group_name = $b.prop("name");
		var $check_group = $("input[name=\""+check_group_name+"\"]");
		for(var i = 0; i < $check_group.length; i++){
			if($check_group[i].checked){
				option_length += 1;
			}
		}
		var max_select = questions[tr_index].max_select;
		if(is_selected && max_select != ""){
			if(option_length > max_select){
				$b.prop("checked",false);
				return;
			}
		}
	}

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

function verify(a,submit_type){
	var flag = true;
	if(a.must_answer == true & a.select.length < a.n_set & a.show){
		wrong_info += "第"+(a.index+1)+"题为必答题!\n";
		flag = false;
	}
	if(a.s_type == 2 || a.s_type == 5){
		if((a.min_select != "" & a.select.length < a.min_select) || (a.max_select != "" & a.select.length > a.max_select)){
			wrong_info += "第"+(a.index+1)+"题选择选项数量有误!\n";
			flag = false;
		}
	}
	if(submit_type == 0){
		if(flag == false){
			$("#Q_"+(a.index+1)).parents("tr").css('background-color','#f2dede');
		}
		else{
			$("#Q_"+(a.index+1)).parents("tr").css('background-color','');
		}
	}
	return flag;
}

function addToSort(b){
	var $b = $(b);
	var id_str = $b.prop("id");
	var option_index = $b.prop("value");
	var is_selected = $('#'+id_str).get(0).checked;
	var text = $('#'+id_str).parent().text();
	var option_length = 0;
	if(is_selected){
		option_length = $('#'+id_str).parent().parent().parent().find('select')[0].options.length+1;
	}
	else{
		option_length = $('#'+id_str).parent().parent().parent().find('select')[0].options.length-1;
	}
	var index = $b.parents("tr").index();
	var max_select = questions[index].max_select;
	if(is_selected && max_select != ""){
		if(option_length > max_select){
			$('#'+id_str).get(0).checked = false;
			return;
		}
	}
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

function submit(flag){
	answers = new Array();
	wrong_info = "[填写错误信息]\n";
	var legal = true;
	for(var line = 0; line < questions.length; line++){
		var q = questions[line];
		var i = q.index;
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
				a.min_select = q.min_select;
				a.max_select = q.max_select;
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
		answers.push(a);
		if(verify(a,flag) == false){
			legal = false;
		}
	}
	if(flag == 0){
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
					data: {'op': 'submit', 'complete': 'yes', 'astring': Astring, 'load_time': load_time_format,'submit_time':submit_time_format},
					success: function(data) {
						data = JSON.parse(data);
						alert('提交成功');
						window.location.href = '/bonus?credit=' + data['credit'];
					}
				});
			}
		}
		else{
			alert(wrong_info);
			return;
		}
	}
	if(flag == 1){
		var Astring = JSON.stringify(answers);
		var Astring = JSON.stringify(answers);
		now_time = new Date();
		submit_time = now_time.getTime();
		submit_time_format = gettimeformat(now_time);
		var dwell_time = submit_time - load_time;
		$.ajax({
			url: window.location.href,
			type: 'POST',
			data: {'op': 'submit', 'complete': 'no', 'astring': Astring, 'load_time': load_time_format,'submit_time':submit_time_format},
			success: function(data) {
				data = JSON.parse(data);
			}
		});
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



function createReportHtml(result){
	var index = result.index;
	var HTMLContent = "<td>";
	switch(result.s_type){
		case 1:{
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + result.title+"</font></div>";
			HTMLContent += "<table class=\"table\"><tr><td>选项</td><td>小计</td><td>比例</td></tr>";
			for(var i = 0; i < result.n_option; i ++){
				HTMLContent += "<tr>";
				var option = result.options[i];
				HTMLContent += "<td>";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += option.image;
				}
				HTMLContent += "</td><td>" + option.num + "</td><td>" + (parseFloat(option.ratio)*100).toString() + "%</td>";

				HTMLContent += "</tr>";
			}
			HTMLContent += "</table>";
			HTMLContent += "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-info btn-sm\" onclick=\"doughnut(this)\">饼状图</button><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"bar(this)\">柱状图</button><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"Hbar(this)\">条形图</button><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"clearCanvas(this)\">隐藏统计图</button></div>";
	
			HTMLContent += "</td>";
			break;
		}
		case 2:{
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + result.title+"</font></div>";
			HTMLContent += "<table class=\"table\"><tr><td>选项</td><td>小计</td><td>比例</td></tr>";
			for(var i = 0; i < result.n_option; i ++){
				HTMLContent += "<tr>";
				var option = result.options[i];
				HTMLContent += "<td>";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += option.image;
				}
				HTMLContent += "</td><td>" + option.num + "</td><td>" + (parseFloat(option.ratio)*100).toString() + "%</td>";

				HTMLContent += "</tr>";
			}
			HTMLContent += "</table>";
			HTMLContent += "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-info btn-sm\" onclick=\"doughnut(this)\">饼状图</button><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"bar(this)\">柱状图</button><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"Hbar(this)\">条形图</button><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"clearCanvas(this)\">隐藏统计图</button></div>";
	
			HTMLContent += "</td>";
			break;
		}
		case 4:{
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + result.title+"</font></div>";
			HTMLContent += "<table class=\"table\"><tr><td>选项</td><td>小计</td><td>比例</td></tr>";
			for(var i = 0; i < result.n_option; i ++){
				HTMLContent += "<tr>";
				var option = result.options[i];
				HTMLContent += "<td>";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += option.image;
				}
				HTMLContent += "</td><td>" + option.num + "</td><td>" + (parseFloat(option.ratio)*100).toString() + "%</td>";

				HTMLContent += "</tr>";
			}
			HTMLContent += "</table>";
			HTMLContent += "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-info btn-sm\" onclick=\"doughnut(this)\">饼状图</button><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"bar(this)\">柱状图</button><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"Hbar(this)\">条形图</button><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"clearCanvas(this)\">隐藏统计图</button></div>";
	
			HTMLContent += "</td>";
			break;
		}
		case 5:{
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + result.title+"</font></div>";
			HTMLContent += "<table class=\"table\"><tr><td>选项</td><td>排序</td><td>小计</td><td>比例</td></tr>";
			for(var i = 0; i < result.n_option * 2; i ++){
				HTMLContent += "<tr>";
				var option = result.options[i];
				HTMLContent += "<td>";
				if(option.option_type==0){
					HTMLContent += option.text;
				}
				if(option.option_type==1){
					HTMLContent += option.image;
				}
				HTMLContent += "</td><td>" + option.rank +"</td><td>" + option.num + "</td><td>" + (parseFloat(option.ratio)*100).toString() + "%</td>";
				HTMLContent += "</tr>";
			}
			HTMLContent += "</table>";
			HTMLContent += "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"Sbar(this)\">柱状图</button><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"clearCanvas(this)\">隐藏统计图</button></div>";
	
			HTMLContent += "</td>";
			break;
		}
		case 6:{
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + result.title+"</font></div>";
			HTMLContent += "<table class=\"table\"><tr><td>选项</td><td>小计</td><td>比例</td></tr>";
			for(var i = 0; i < result.n_option; i ++){
				HTMLContent += "<tr>";
				var option = result.options[i];
				HTMLContent += "<td>"+option.text+"-"+option.image;
				
				HTMLContent += "</td><td>" + option.num + "</td><td>" + (parseFloat(option.ratio)*100).toString() + "%</td>";

				HTMLContent += "</tr>";
			}
			HTMLContent += "</table>";
			HTMLContent += "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"Mbar(this)\">柱状图</button><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"clearCanvas(this)\">隐藏统计图</button></div>";
	
			HTMLContent += "</td>";
			break;
		}
	}
	return HTMLContent;
	
}

function clearCanvas(b){
	var $b = $(b);
	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
}



function doughnut(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	
	var result = results[index];
	var option_text = new Array();
	var option_num = new Array();
	for(var i = 0; i < result.n_option; i++){
		var option = result.options[i];
		if(option.option_type == 0){
			option_text.push(option.text);
		}
		if(option.option_type == 1){
			option_text.push(option.image);
		}
		option_num.push(option.num);
	}
	

	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
	$b.parents("td").append("<div id=\""+canvas_id+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>");
	
    drawDoughnut(canvas_id, option_text, option_num);
    

}

function bar(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	
	var result = results[index];
	var option_text = new Array();
	var option_num = new Array();
	for(var i = 0; i < result.n_option; i++){
		var option = result.options[i];
		if(option.option_type == 0){
			option_text.push(option.text);
		}
		if(option.option_type == 1){
			option_text.push(option.image);
		}
		option_num.push(option.num);
	}
	

	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
	$b.parents("td").append("<div id=\""+canvas_id+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>");
	
    drawBar(canvas_id, option_text, option_num);
    
}

function Hbar(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	
	var result = results[index];
	var option_text = new Array();
	var option_num = new Array();
	for(var i = 0; i < result.n_option; i++){
		var option = result.options[i];
		if(option.option_type == 0){
			option_text.push(option.text);
		}
		if(option.option_type == 1){
			option_text.push(option.image);
		}
		option_num.push(option.num);
	}
	

	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
	$b.parents("td").append("<div id=\""+canvas_id+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>");
	
    drawHBar(canvas_id, option_text, option_num);
    
}


function Mbar(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	
	var result = results[index];
	var rowlabels = new Array();
	var collabels = new Array();
	var data = new Array();
	var n_col = result.n_option / result.n_set;
	var n_row = result.n_set;
	for(var i = 0; i < n_col; i++){
		collabels.push(result.options[i].image);
		var col_data = new Array();
		for(var j = 0; j < n_row; j ++){
			col_data.push(result.options[j*n_col+i].num);
		}
		data.push(col_data);
	}
	for(var i = 0; i < n_row; i++){
		rowlabels.push(result.options[i*n_col].text);
	}
	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
	$b.parents("td").append("<div id=\""+canvas_id+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>");
	drawMBar(canvas_id,rowlabels,collabels,data);
}

function Sbar(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	
	var result = results[index];
	var rowlabels = new Array();
	var collabels = ["0","1"];
	var data = new Array();
	var n_col = 2;
	var n_row = result.n_option;
	for(var i = 0; i < n_col; i++){
		var col_data = new Array();
		for(var j = 0; j < n_row; j ++){
			col_data.push(result.options[j*n_col+i].num);
		}
		data.push(col_data);
	}
	for(var i = 0; i < n_row; i++){
		rowlabels.push(result.options[i*n_col].text);
	}
	var canvas_id = 'canvas' + $b.parents("tr").index();
	$b.parents("td").children("div#"+canvas_id).remove();
	$b.parents("td").append("<div id=\""+canvas_id+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>");
	drawSBar(canvas_id,rowlabels,collabels,data);
}

