//for design website
var option_html = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><input type=\"file\" accept=\"image/*\" id=\"image\" onchange=\"uploadImage(this)\"><input type=\"hidden\" id=\"image_fn\"><label id=\"fn_display\"></label></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><input type=\"text\" class=\"form-control input-sm\" placeholder=\"请输入标题\" style=\"width:100%;\" id=\"s_title\"></td></tr></thead>"
var questions = new Array();
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

function save(){
	//s_type title [n_option [option1..] 
	//save Qstring into database
	var Qstring = JSON.stringify(questions);
	
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'save', 'qstring': Qstring},
		success: function(data) {
			data = JSON.parse(data);
		}
	});
}

function release() {

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
			//multiple choice
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
		case 3:{
			//completion
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
		}
	}
}

function createHtml(){
	switch(current_status.s_type){
		case 1:{
			var q = {s_type:1};
			var HTMLContent = "<td>";
			var index = current_status.index;
			HTMLContent += "<div>"+(index + 1).toString() + "." + document.getElementById("s_title").value+"</div>";
			var rows = document.getElementById("options").rows;
			q.title = document.getElementById("s_title").value;
			q.n_option = rows.length-1;
			q.options = [];
			HTMLContent += "<div><form>";
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				options.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = cols[1].children[1].value;
				q.options.push(option);
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"single\"> "+String.fromCharCode(i + 64)+". "+option.text+"</p>";
			}
			HTMLContent += "</form></div></td>";
			questions.push(q);
			return HTMLContent;
			break;
		}
		case 2:{
			var q = {s_type:2};
			var HTMLContent = "<td>";
			var index = current_status.index;
			HTMLContent += "<div>"+(index + 1).toString() + "." + document.getElementById("s_title").value+"</div>";
			var rows = document.getElementById("options").rows;
			q.title = document.getElementById("s_title").value;
			q.n_option = rows.length-1;
			q.options = [];
			HTMLContent += "<div><form>";
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				options.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = cols[1].children[1].value;
				q.options.push(option);
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"single\"> "+String.fromCharCode(i + 64)+". "+option.text+"</p>";
			}
			HTMLContent += "</form></div></td>";
			questions.push(q);
			return HTMLContent;
			break;
		}
		case 3:{
			var q = {s_type:3};
			var HTMLContent = "<td>";
			var index = current_status.index;
			HTMLContent += "<div>"+(index + 1).toString() + "." + document.getElementById("s_title").value+"</div>";
			q.title = document.getElementById("s_title").value;
			HTMLContent += "<form>";
			HTMLContent += "<p class=\"q_item\"><input type=\"text\"></p>";
			HTMLContent += "</form></div></td>";
			questions.push(q);
			return HTMLContent;
			break;
		}
	}
}

function commitS(){
	$("#myModal").modal('hide');
	var q_table = document.getElementById("questions");
	var new_row = q_table.insertRow(-1);
	new_row.innerHTML = createHtml();
	current_status.index ++;
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
