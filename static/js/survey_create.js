//for design website
var option_html = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><input type=\"file\" id=\"image\" onchange=\"uploadImage(this)\"><input type=\"hidden\" id=\"image_fn\"><label id=\"fn_display\"></label></td><td><input type=\"checkbox\" name=\"single\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var option_html_text = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>";
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><input type=\"text\" class=\"form-control input-sm\" placeholder=\"请输入标题\" style=\"width:100%;\" id=\"s_title\"></td></tr></thead>"
var questions = new Array();
var current_status = {s_type: 0, action: 0, index: 0};
var n_option_default = 4;
var image_size_lim = 4096 * 1024;
var q_table = document.getElementById("questions");
var operate_index = current_status.index;

function getindex(Qstring){
	var q_table = document.getElementById("questions");
	current_status.index = document.getElementById('questions').rows.length;
	
}

function myclick(){
	alert(JSON.stringify(questions));
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
	var title = $('input#title').val();
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'save', 'title': title, 'qstring': Qstring},
		success: function(data) {
			data = JSON.parse(data);
			alert('Save successful');
		}
	});
}

function release() {
	var Qstring = JSON.stringify(questions);
	var title = $('input#title').val();
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'release', 'title': title, 'qstring': Qstring},
		success: function(data) {
			data = JSON.parse(data);
			alert('Release successful');
			window.location.reload()
		}
	});
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
										+"<td class=\"fill_col\">允许填空</td>"
										+"<td class=\"op_col\">操作</td></tr>";
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
										+"<td class=\"fill_col\">允许填空</td>"
										+"<td class=\"op_col\">操作</td></tr>";
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
			break;
		}
		case 4:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td><input type=\"radio\" name=\"single\" onclick=\"buildBox(1)\">性别</td>"+
									"<td><input type=\"radio\" name=\"single\" onclick=\"buildBox(2)\">院系</td>"+
									"<td><input type=\"radio\" name=\"single\" onclick=\"buildBox(3)\">就读学位</td>"+
									"<td><input type=\"radio\" name=\"single\" onclick=\"buildBox(4)\">年级</td>"+
									"<td><input type=\"radio\" name=\"single\" onclick=\"buildBox(5)\">自定义</td>"+
									"</tr>");
			$mymodal_table.eq(2).attr("id","options");
			$mymodal_table.eq(2).addClass("table-striped");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			break;
		}
		case 5:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">选项文字</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			break;
		}
		case 6:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options_row");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">行标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$mymodal_table.eq(2).attr("id","options_col");
			$mymodal_table.eq(2).addClass("table-striped");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">列标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			break;
		}
	}
}

function buildBox(box_type){
	var $mymodal_table = $("#myModal_body").children(".table");
	$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
	$mymodal_tbody.empty();
	$mymodal_tbody.append("<tr><td class=\"text_col\">选项文字</td>"
							+"<td class=\"op_col\">操作</td></tr>");
	switch(box_type){
		case 1:{
			var content = ["男","女"];
			for(var i = 0; i < content.length; i++){
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$('.option_text').eq(i).children().eq(0).children().eq(0).attr("value",content[i]);
			}
			break;
		}
		case 2:{
			var content = ["建筑","土木","水利","环境","机械","精仪","热能","汽车","电机","电子","计算机","自动化","工物","航院","化工","材料","数学","物理","化学","生命","经管","公管","人文","社科","马院","法学院","美院","核研院","微纳电子","工业工程","医学院","软件","新闻","教研院","地学中心","金融","深研院","交叉信息学院","高等研究院"];
			for(var i = 0; i < content.length; i++){
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$('.option_text').eq(i).children().eq(0).children().eq(0).attr("value",content[i]);
			}
			break;
		}
		case 3:{
			var content = ["硕士","直博","普博"];
			for(var i = 0; i < content.length; i++){
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$('.option_text').eq(i).children().eq(0).children().eq(0).attr("value",content[i]);
			}
			break;
		}
		case 4:{
			var content = ["一年级","二年级","三年级","四年级","五年级","以上"];
			for(var i = 0; i < content.length; i++){
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$('.option_text').eq(i).children().eq(0).children().eq(0).attr("value",content[i]);
			}
			break;
		}
		case 5:{
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			break;
		}
	}

}


function getQFromModal(){
	switch(current_status.s_type){
		case 1:{
			var q = {s_type:1};
			q.index = operate_index;
			var rows = document.getElementById("options").rows;
			q.title = document.getElementById("s_title").value;
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				option.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = cols[1].children[0].value;
				option.allow_filled = cols[2].children[0].checked;
				if(option.image != ""){
					option.option_type = 1;
				}
				else{
					option.option_type = 0;
				}
				q.options.push(option);
			}
			return q;
			break;
		}
		case 2:{
			var q = {s_type:2};
			q.index = operate_index;
			var rows = document.getElementById("options").rows;
			q.title = document.getElementById("s_title").value;
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				option.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = cols[1].children[0].value;
				option.allow_filled = cols[2].children[0].checked;
				if(option.image != null){
					option.option_type = 1;
				}
				else{
					option.option_type = 0;
				}
				q.options.push(option);
			}
			return q;
			break;
		}
		case 3:{
			var q = {s_type:3};
			q.index = operate_index;
			q.title = document.getElementById("s_title").value;
			return q;
			break;
		}
		case 4:{
			var q = {s_type:4};
			q.index = operate_index;
			q.title = document.getElementById("s_title").value;
			var rows = document.getElementById("options").rows;
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				option.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = "";
				option.option_type = 0;
				q.options.push(option);
			}
			return q;
			break;
		}
		case 5:{
			var q = {s_type:5};
			q.index = operate_index;
			q.title = document.getElementById("s_title").value;
			var rows = document.getElementById("options").rows;
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {};
				var cols = rows[i].children;
				option.index = i-1;
				option.text = cols[0].children[0].value;
				option.image = "";
				option.option_type = 0;
				q.options.push(option);
			}
			return q;
			break;
		}
		case 6:{
			var q = {s_type:6};
			q.index = operate_index;
			q.title = document.getElementById("s_title").value;
			var rows = document.getElementById("options_row").rows;
			var cols = document.getElementById("options_col").rows;
			q.n_option = (rows.length - 1) * (cols.length - 1);
			q.n_set = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i++){
				for(var j = 1; j < cols.length; j++){
					var option = {}
					option.index = (i -1) * (cols.length-1) + j-1;
					//text refer to row title
					option.text = rows[i].children[0].children[0].value;
					//image refer to col title
					option.image = cols[j].children[0].children[0].value;
					option.option_type = 0;
					q.options.push(option);
				}
			}
			return q;
			break;
		}
	}
}

function createHtml(q){
	var HTMLContent = "<td>";
	switch(q.s_type){
		case 1:{
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title+"</div>";
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"single\"> "+String.fromCharCode(i + 65)+". ";
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
		case 2:{
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." +q.title+"</div>";
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"single\"> "+String.fromCharCode(i + 65)+". ";
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
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title+"</div>";
			HTMLContent += "<form>";
			HTMLContent += "<p class=\"q_item\"><input type=\"text\"></p>";
			HTMLContent += "</form></div>";
			break;
		}
		case 4:{
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title+"</div>";
			HTMLContent += "<div><select><option value = \"\">--请选择--</option>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<option value=\""+i.toString()+"\">"+option.text+"</option>";
			}
			HTMLContent += "</select></div>";
			break;
		}
		case 5:{
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title+"</div>";
			HTMLContent += "<ul style=\"float:left;margin:0px;padding:0px;\">";
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				HTMLContent += "<li><input type=\"checkbox\" name=\"single\">"+option.text+"</li>";
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
			var index = q.index;
			HTMLContent += "<div class=\"h3\">"+(index + 1).toString() + "." + q.title+"</div>";
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
					HTMLContent += "<td><input type=\"radio\" name=\"single"+ i.toString() +"\"></td>";
				}
				HTMLContent += "</tr>";
			}
			HTMLContent += "</tbody></table>";
			break;
		}
	}
	HTMLContent += "<br><div><button class=\"btn btn-primary btn-sm\" onclick=\"addQAfter("+q.index.toString()+")\">插入</button><button class=\"btn btn-danger btn-sm\" onclick=\"deleteQ("+q.index.toString()+")\">删除</button></div><hr>";
	HTMLContent += "</td>";
	return HTMLContent;
}

function addQAfter(index){
	alert("请在上方选择题型");
	operate_index = index+1;
}

function deleteQ(index){
	current_status.index --;
	q_table.deleteRow(index);
	questions.splice(index, 1);
	var rows = q_table.rows;
	for(var i = index; i < questions.length; i ++)
	{
		questions[i].index --;
		rows[i].innerHTML = createHtml(questions[i]);
	}
}

function commitS(){
	var q = getQFromModal();
	if(!q) return;
	$("#myModal").modal('hide');
	if(operate_index == current_status.index){
		questions.push(q);
		var new_row = q_table.insertRow(-1);
		new_row.innerHTML = createHtml(q);
		current_status.index ++;
		operate_index = current_status.index;
	}
	else{
		questions.splice(operate_index,0,q);
		var new_row = q_table.insertRow(operate_index);
		new_row.innerHTML = createHtml(q);
		var rows = q_table.rows;
		for(var i = operate_index+1; i < questions.length; i ++)
		{
			questions[i].index ++;
			rows[i].innerHTML = createHtml(questions[i]);
		}
		current_status.index ++;
		operate_index = current_status.index;
	}
}

function addOption(b)
{
	var current_row = b.parentNode.parentNode;
	var row_type = current_row.getAttribute("class");
	var current_index = current_row.rowIndex;
	var op_table = b.parentNode.parentNode.parentNode;
	var new_row = op_table.insertRow(current_index + 1);
	if(row_type == "option_text"){
		new_row.innerHTML = option_html_text;
		new_row.setAttribute("class","option_text");
	}
	else{
		new_row.innerHTML = option_html;
	}
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
	var op_table = b.parentNode.parentNode.parentNode;
	if(current_index == 1 && op_table.rows.length == 2)
	{
		alert("At least one option");
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

function uploadImage(x)
{
	var tmp = x.value.lastIndexOf('.');
	if(tmp == -1){
		alert("必须是图片文件！");
		clearInput(x);
		return;
	}
	else{
		var suffix = x.value.substring(tmp, x.value.length).toLowerCase();
		if(suffix != ".jpeg" && suffix != ".jpg" && suffix != ".png" && suffix != ".bmp")
		{
			alert("必须是图片文件！");
			clearInput(x);
			return;
		}
	}
	if(x.files[0].size > image_size_lim)
	{
		alert("图片最大不能超过4M!");
		clearInput(x);
		return;
	}
	var formData = new FormData();
	formData.append("file", x.files[0]);
    $.ajax({
        url: '/upload_file/',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(returndata) {
        	returndata = JSON.parse(returndata);
        	if(returndata.status == "yes")
        	{
        		x.parentNode.children[1].value = returndata['url'];
        	}
        	else
        	{
        		alert("上传失败！");
        		clearInput(x);
        	}
        },
        error: function(returndata) {
            alert("出错了！");
            clearInput(x);
        }
    });

	
}

function clearInput(input)
{
	input.outerHTML = input.outerHTML;
}
