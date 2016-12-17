//for design website
//var choice_html = "<div class=\"container\" style=\"width:100%\" id=\"choice_modal\"><div class=\"row\"><div class=\"col-sm-8\"><table class=\"table table-condensed\"><thead><tr class=\"active\"><td>题目标题</td></tr></thead><tr><td style=\"padding:0 0 0 0;\"><input type=\"text\" class=\"form-control input-sm\" placeholder=\"请输入标题\" style=\"width:100%;\" id=\"q_title\"></td></tr></table></div><div class=\"col-sm-4\"><div><input type=\"checkbox\" checked=\"checked\" id=\"required\">必答</div><div><input type=\"checkbox\" id=\"random_op\">选项随机</div><div id=\"score_count_div\"><input type=\"checkbox\" id=\"score_count\">不计分</div><div id=\"show_ans_div\"><input type=\"checkbox\" id=\"show_ans\">答完显示正确答案</div></div></div><div class=\"row\"><div class=\"col-sm-12\"><table class=\"table table-striped table-condensed\" id=\"options\"><tbody><tr class=\"active\"><td class=\"text_col\">选项文字</td><td class=\"img_col\">图片</td><td class=\"sm_col\">默认</td><td class=\"sm_col\">答案</td><td class=\"sm_col\">名额</td><td class=\"op_col\">操作</td></tr></tbody></table></div></div><div class=\"row\"><div class=\"col-sm-12\"><div id=\"vote_info\"><input type=\"checkbox\" id=\"show_nvote\">&nbsp;显示投票数&nbsp;&nbsp;<input type=\"checkbox\" id=\"show_pvote\">&nbsp;显示百分比</div><div id=\"sign_info\"><input type=\"checkbox\" id=\"show_nleft\">&nbsp;显示余量&nbsp;&nbsp;<input type=\"checkbox\" id=\"show_nsigned\">&nbsp;显示已选</div><div id=\"test_info\">分值&nbsp;<input type=\"text\" id=\"score\" class=\"num_input\">&nbsp;&nbsp;答案解析&nbsp;<input type=\"text\" id=\"analysis\"></div><div id=\"multi_info\">最少选&nbsp;<select id=\"multi_min\"><option>无限制</option></select>&nbsp;&nbsp;最多选&nbsp;<select id=\"multi_max\"><option>无限制</option></select></div></div></div></div>";
//var option_html = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><input type=\"file\" accept=\"image/*\" id=\"image\" onchange=\"uploadImage(this)\"><input type=\"hidden\" id=\"image_fn\"><label id=\"fn_display\"></label></td><td><input type=\"checkbox\"></td><td><input type=\"checkbox\"></td><td><input type=\"text\" class=\"inner_input\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span><span class=\"glyphicon glyphicon-chevron-up\" onclick=\"upOption(this)\"></span><span class=\"glyphicon glyphicon-chevron-down\" onclick=\"downOption(this)\"></span></td>";
var option_html = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><input type=\"file\" accept=\"image/*\" id=\"image\" onchange=\"uploadImage(this)\"><input type=\"hidden\" id=\"image_fn\"><label id=\"fn_display\"></label></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><input type=\"text\" class=\"form-control input-sm\" placeholder=\"请输入标题\" style=\"width:100%;\" id=\"s_title\"></td></tr></thead>"

var current_status = {s_type: 0, action: 0, index: 0};
var n_option_default = 4;
function myclick(){
	alert("success!");
}

function createSurvey(s_type){
	current_status.s_type = s_type;
	current_status.action = 1;
	createModal();
}

function createModal(){
	switch(current_status.s_type){
		case 1:{
			//single choice
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"text_col\">选项文字</td>"
										+"<td class=\"img_col\">图片</td>"
										+"<td class=\"op_col\">操作</td>";
			$mymodal_tbody.append(single_table_title);
			$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			//alert(s_modal.innerHTML);
			break;
		}
		case 2:{
			//multi choice
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"text_col\">选项文字</td>"
										+"<td class=\"img_col\">图片</td>"
										+"<td class=\"op_col\">操作</td>";
			$mymodal_tbody.append(single_table_title);
			$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			//alert(s_modal.innerHTML);
			break;
		}
	}
}

function createHtml(){
	switch(current_status.s_type){
		case 1:{
			var HTMLContent = "";
			var index = current_status.index;
			HTMLContent += (index + 1).toString() + "." + document.getElementById("s_title").value;
			var rows = document.getElementById("options").rows;
			for(var i = 1; i < rows.length; i ++)
			{
				var cols = rows[i].children;
				var text = cols[0].children[0].value;
				var image = cols[1].children[1].value;
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"single\"> "+String.fromCharCode(i + 64)+". "+text+"</p>";
			}
			return HTMLContent;
			break;
		}
		case 2:{
			var HTMLContent = "";
			var index = current_status.index;
			HTMLContent += (index + 1).toString() + "." + document.getElementById("s_title").value;
			var rows = document.getElementById("options").rows;
			for(var i = 1; i < rows.length; i ++)
			{
				var cols = rows[i].children;
				var text = cols[0].children[0].value;
				var image = cols[1].children[1].value;
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"single\"> "+String.fromCharCode(i + 64)+". "+text+"</p>";
			}
			return HTMLContent;
			break;
		}
	}
}

function commitS(){
	switch(current_status.s_type){
		case 1:{
			$("#myModal").modal('hide');
			var q_table = document.getElementById("questions");
			var new_row = q_table.insertRow(-1);
			new_row.innerHTML = createHtml();
			current_status.index ++;
			break;
		}
		case 2:{
			$("#myModal").modal('hide');
			var q_table = document.getElementById("questions");
			var new_row = q_table.insertRow(-1);
			new_row.innerHTML = createHtml();
			current_status.index ++;
			break;
		}
	}
}

function addOption(b)
{
	var current_row = b.parentNode.parentNode;
	var current_index = current_row.rowIndex;
	var op_table = document.getElementById("options");
	var new_row = op_table.insertRow(current_index + 1);
	new_row.innerHTML = option_html;
	/*
	if(current_status.qtype == 41)
		new_row.innerHTML = mat_option_html;
	else
	{
		new_row.innerHTML = option_html;
		var multi_min = document.getElementById("multi_min");
		var multi_max = document.getElementById("multi_max");
		var len = multi_min.length;
		var x = document.createElement("option");
		var y =document.createElement("option");
		x.text = len.toString();
		y.text = len.toString();
		multi_min.add(x, null);
		multi_max.add(y, null);
	}
	*/
}
function delOption(b)
{
	var current_row = b.parentNode.parentNode;
	var current_index = current_row.rowIndex;
	var op_table = document.getElementById("options");
	if(current_index == 1 && op_table.rows.length == 2)
	{
		alert("至少要有一个选项！");
		return;
	}
	op_table.deleteRow(current_index);
	/*
	var multi_min = document.getElementById("multi_min");
	var multi_max = document.getElementById("multi_max");
	var len = multi_max.length;
	multi_min.remove(len - 1);
	multi_max.remove(len - 1);
	*/
}
