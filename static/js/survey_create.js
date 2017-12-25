//for design website
var option_html = "<td><input type=\"text\" id=\"option_index\" class=\"form-control input-sm\"></td><td><input type=\"text\" id=\"option_text\" class=\"form-control input-sm\"></td><td><input type=\"file\" id=\"image\" onchange=\"uploadImage(this)\"><input type=\"hidden\" id=\"image_fn\"><p id=\"file_name\"></p></td><td><input type=\"checkbox\" name=\"single\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var option_html_text = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>";
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><div id=\"myNicPanel\" style=\"width: 100%;\"></div><p id=\"s_title\" style=\"width:100%;height:80px;\" class=\"form-control input-sm\"> </p></td></tr></thead>"
var condition_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td><td id=\"jump_to\" ><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td><td id=\"jump_from\" ><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td><tr>";
var questions = new Array();
var results = new Array();
var current_status = {s_type: 0, action: 0, index: 0};
var n_option_default = 4;
var image_size_lim = 4096 * 1024;
var q_table = document.getElementById("questions");
var operate_index = current_status.index;

function getindex(){
	var q_table = document.getElementById("questions");
	var row_length = document.getElementById('questions').rows.length;
	current_status.index += row_length;
	operate_index = current_status.index;
}

function clone(myObj){  
    var new_obj = {};
    new_obj.s_type = myObj.s_type;
    new_obj.index = myObj.index;
    new_obj.title_html = myObj.title_html;
    new_obj.title = myObj.title;
   	new_obj.n_option =  myObj.n_option;
   	if(myObj.hasOwnProperty("n_set")){
   		new_obj.n_set = myObj.n_set;
   	}
   	new_obj.options = myObj.options;
   	new_obj.must_answer = myObj.must_answer;
   	new_obj.jump_to = myObj.jump_to;
   	new_obj.jump_from = myObj.jump_from;
   	if(myObj.hasOwnProperty("min_select")){
   		new_obj.min_select = myObj.min_select;
   	}
   	if(myObj.hasOwnProperty("max_select")){
   		new_obj.max_select = myObj.max_select;
   	}
   	return new_obj;
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
			alert('暂存成功!');
		}
	});
}

function release() {
	var Qstring = JSON.stringify(questions);
	var title = $('input#title').val();
	var sample_list_id = $('select#sample_list').val();
	var ifpublic = $('#ifpublic').prop('checked') ? 1 : 0;
	var credit = $('#credit').val();
	if (credit == "") credit = -1;
	if((new RegExp("^-{0,1}[1-9][0-9]*$")).test(credit) == false){
		alert("积分需填写数字");
		return;
	}
	$.ajax({
		url: window.location.pathname,
		type: 'POST',
		data: {'op': 'release', 'title': title, 'qstring': Qstring, 'sample_list_id': sample_list_id, 'ifpublic': ifpublic, 'credit': credit},
		success: function(data) {
			data = JSON.parse(data);
			alert('发布成功');
			window.location.reload();
		}
	});
}



function createModal(){
	switch(current_status.s_type){
		case 1:{
			//single choice
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
										+"<td class=\"text_col\">选项文字</td>"
										+"<td class=\"img_col\">图片</td>"
										+"<td class=\"fill_col\">允许填空</td>"
										+"<td class=\"op_col\">操作</td></tr>";
			$mymodal_tbody.append(single_table_title);
			$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			$mymodal_tbody.find("input[id=\"option_index\"]").val("A");
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append(condition_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			//alert(s_modal.innerHTML);
			break;
		}
		case 2:{
			//multiple choice
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
										+"<td class=\"text_col\">选项文字</td>"
										+"<td class=\"img_col\">图片</td>"
										+"<td class=\"fill_col\">允许填空</td>"
										+"<td class=\"op_col\">操作</td></tr>";
			$mymodal_tbody.append(single_table_title);
			$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			$mymodal_tbody.find("input[id=\"option_index\"]").val("A");
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			var condition_multi_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td>"+
			                           "<td id=\"jump_to\"><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td>"+
			                           "<td id=\"jump_from\"><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td>"+
			                           "<td id=\"min_select\">至少选<input type=\"text\" style=\"width:40px\">项</td>"+
			                           "<td id=\"max_select\">至多选<input type=\"text\" style=\"width:40px\">项</td><tr>";
			$mymodal_tbody.append(condition_multi_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			//alert(s_modal.innerHTML);
			break;
		}
		case 3:{
			//completion
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","conditions");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append(condition_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 4:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html,table_html);
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
			$mymodal_table.eq(3).attr("id","conditions");
			$mymodal_table.eq(3).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(3).children().eq(0);
			$mymodal_tbody.append(condition_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 5:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">选项文字</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			var condition_multi_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td>"+
			                           "<td id=\"jump_to\"><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td>"+
			                           "<td id=\"jump_from\"><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td>"+
			                           "<td id=\"min_select\">至少选<input type=\"text\" style=\"width:40px\">项</td>"+
			                           "<td id=\"max_select\">至多选<input type=\"text\" style=\"width:40px\">项</td><tr>";
			$mymodal_tbody.append(condition_multi_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 6:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html,table_html);
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
			$mymodal_table.eq(3).attr("id","conditions");
			$mymodal_table.eq(3).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(3).children().eq(0);
			$mymodal_tbody.append(condition_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 7:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">小标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append(condition_html);
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 8:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');

			break;
		}
		case 9:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
	}
}

function jump(index){
	if(index == 1){
		var $jump_to_html = $("#jump_to");
		var $check = $jump_to_html.children().eq(0);
		if($check.prop("checked")==false){
			$jump_to_html.empty();
			$jump_to_html.append("<input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题");
		}
		else{
			$jump_to_html.append("<input type=\"text\" style=\"width:40px\"> 题");
		}
	}
	else{
		var $jump_from_html = $("#jump_from");
		var $check = $jump_from_html.children().eq(0);
		if($check.prop("checked")==false){
			$jump_from_html.empty();
			$jump_from_html.append("<input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑");
		}
		else{
			$jump_from_html.append("<input type=\"text\" style=\"width:40px\"> 题 <input type=\"text\" style=\"width:40px\"> 项");
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
	var q = {s_type:current_status.s_type};
	//q.index
	if(questions.length == 0){
		q.index = 0;
	}
	else{
		for(var i = operate_index-1; i >= 0; i--){
			if(questions[i].s_type != 8){
				q.index = questions[i].index+1; 
				break;
			}
			if(i == 0 && questions[0].s_type == 8){
				q.index = 0;
			}
		}
	}
	switch(current_status.s_type){
		case 1:{
			var rows = document.getElementById("options").rows;
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			if(rows[1].children[1].children[0].value == "" & rows[1].children[2].children[1].value == ""){
				q.n_option = 0;
				q.options = [];
			}
			else{
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				option.index = cols[0].children[0].value;
				option.text = cols[1].children[0].value;
				option.image = cols[2].children[1].value;
				option.allow_filled = cols[3].children[0].checked;
				if(option.image != ""){
					option.option_type = 1;
				}
				else{
					option.option_type = 0;
				}
				q.options.push(option);
			}
			}
			break;
		}
		case 2:{
			var rows = document.getElementById("options").rows;
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			if(rows[1].children[1].children[0].value == "" & rows[1].children[2].children[1].value == ""){
				q.n_option = 0;
				q.options = [];
			}
			else{
			q.n_option = rows.length-1;
			q.options = [];
			for(var i = 1; i < rows.length; i ++)
			{
				var option = {}
				var cols = rows[i].children;
				option.index = cols[0].children[0].value;
				option.text = cols[1].children[0].value;
				option.image = cols[2].children[1].value;
				option.allow_filled = cols[3].children[0].checked;
				if(option.image != ""){
					option.option_type = 1;
				}
				else{
					option.option_type = 0;
				}
				q.options.push(option);
			}
			}
			break;
		}
		case 3:{
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			break;
		}
		case 4:{
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			var rows = document.getElementById("options").rows;
			if(rows == null){
				q.n_option = 0;
				q.options = [];
			}
			else if(rows != null & rows[1].children[0].children[0].value == ""){
				q.n_option = 0;
				q.options = [];
			}
			else{
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
			}
			break;
		}
		case 5:{
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			var rows = document.getElementById("options").rows;
			if(rows[1].children[0].children[0].value == "" ){
				q.n_option = 0;
				q.options = [];
			}
			else{
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
			}
			break;
		}
		case 6:{
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			var rows = document.getElementById("options_row").rows;
			var cols = document.getElementById("options_col").rows;
			if(rows[1].children[0].children[0].value == "" & cols[1].children[0].children[0].value == ""){
				q.n_option = 0;
				q.options = [];
				q.n_set = 0;
			}
			else{
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
			}
			break;
		}
		case 7:{
			var rows = document.getElementById("options").rows;
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			if(rows[1].children[0].children[0].value == "" ){
				q.n_option = 0;
				q.options = [];
			}
			else{
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
			}
			break;
		}
		case 8:{
			q.title_html = $("#s_title").html();
			q.title = $("#s_title").text();
			q.jump_to = false;
			q.jump_from = false;
			q.must_answer = false;
			break;
		}
	}
	if(current_status.s_type != 8){
		//conditions 必答 跳转 依赖关系
		var rows = document.getElementById("conditions").rows;
		var cols = rows[0].children;
		q.must_answer = cols[0].children[0].checked;
		if(cols[1].children[0].checked == true){
			q.jump_to = Number(cols[1].children[1].value);
		}
		else{
			q.jump_to = false;
		}
		if(cols[2].children[0].checked == true){
			q.jump_from = [Number(cols[2].children[1].value),Number(cols[2].children[2].value)];
		}
		else{
			q.jump_from = false;
		}
		if(q.s_type == 2 || q.s_type ==5){
			q.min_select = cols[3].children[0].value;
			q.max_select = cols[4].children[0].value;
		}
	}

	return q;
}

function createHtml(q){
	var HTMLContent = "<td>";
	switch(q.s_type){
		case 1:{
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true){
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"single\"> "+option.index+". ";
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
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
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
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"single\"> "+option.index+". ";
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
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true){
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
			HTMLContent += "<form>";
			HTMLContent += "<p class=\"q_item\"><input type=\"text\" style=\"width:50px\"></p>";
			HTMLContent += "</form></div>";
			break;
		}
		case 4:{
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true){
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
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
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true){
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
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
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true){
				HTMLContent += "*</div>";
			}
			else{
				HTMLContent += "</div>";
			}
			HTMLContent += "<table class=\"table \" style=\"table-layout:fixed;word-break:break-all\"><tbody><tr><td></td>";
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
		case 7:{
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
			if(q.must_answer == true && q.title.replace(" ", "").length != 0){
				HTMLContent += "*</div>";
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				if(i != 0 & i % 3 ==0){
					HTMLContent += "<br>";
				}
				HTMLContent += option.text+"&nbsp<input type=\"text\" name=\"single\" style=\"width:50px\">&nbsp&nbsp";
			}
			if(q.must_answer == true && q.title.replace(" ", "").length == 0){
				HTMLContent += "*";
			}
			HTMLContent += "<br>";
			break;
		}
		case 8:{
			var index = q.index;
			HTMLContent += "<div><font size=\"3\">"+ q.title_html+"</font></div>";
			break;
		}
	}
	HTMLContent += "<br><div><button class=\"btn btn-primary btn-sm\" onclick=\"addQAfter(this)\">插入</button><button class=\"btn btn-danger btn-sm\" onclick=\"deleteQ(this)\">删除</button><button data-toggle=\"modal\" data-target=\"#myModal\" class=\"btn btn-warning btn-sm\" onclick=\"modifyQ(this)\">修改</button>";
	HTMLContent += "<button class=\"btn btn-success btn-sm\" onclick=\"moveQup(this)\">上移</button><button class=\"btn btn-success btn-sm\" onclick=\"moveQdown(this)\">下移</button><button class=\"btn btn-success btn-sm\" onclick=\"copyQ(this)\">复制</button></div><hr>";
	HTMLContent += "</td>";
	return HTMLContent;
}

function moveQup(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	if(index == 0){
		return;
	}
	var swap_index = index - 1;
	if(questions[index].s_type == 8 || questions[swap_index].s_type == 8){
		var temp_q = questions[index];
		questions.splice(index, 1);
		questions.splice(swap_index,0,temp_q);
	}
	else{
		var temp_q = questions[index];
		temp_q.index -= 1;
		questions[swap_index].index += 1;
		questions.splice(index, 1);
		questions.splice(swap_index,0,temp_q);
	}
	var rows = q_table.rows;
	for(var i = 0; i < questions.length; i++){
		rows[i].innerHTML = createHtml(questions[i]);
	}
}

function copyQ(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	var temp_q = clone(questions[index]);
	temp_q.index += 1
	questions.splice(index+1,0,temp_q);
	var new_row = q_table.insertRow(index+1);
	new_row.innerHTML = createHtml(temp_q);
	var rows = q_table.rows;
	for(var i = index+2; i < questions.length; i++){
		if(temp_q.s_type != 8){
			questions[i].index ++;
		}
		rows[i].innerHTML = createHtml(questions[i]);
	}
	current_status.index ++;
	operate_index = current_status.index;

}

function moveQdown(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	if(index == questions.length-1){
		return;
	}
	var swap_index = index + 1;
	if(questions[index].s_type == 8 || questions[swap_index].s_type == 8){
		var temp_q = questions[index];
		questions.splice(index, 1);
		questions.splice(swap_index,0,temp_q);
	}
	else{
		var temp_q = questions[index];
		temp_q.index += 1;
		questions[swap_index].index -= 1;
		questions.splice(index, 1);
		questions.splice(swap_index,0,temp_q);
	}
	var rows = q_table.rows;
	for(var i = 0; i < questions.length; i++){
		rows[i].innerHTML = createHtml(questions[i]);
	}
}

function addQAfter(b){
	alert("请在上方选择题型");
	var $b = $(b);
	var index = $b.parents("tr").index();
	operate_index = index+1;
}

function modifyQ(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	var q = questions[index];
	current_status.action = 2;
	current_status.s_type = q.s_type;
	switch(q.s_type){
		case 1:{
			//single choice
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
									+"<td class=\"text_col\">选项文字</td>"
									+"<td class=\"img_col\">图片</td>"
									+"<td class=\"fill_col\">允许填空</td>"
									+"<td class=\"op_col\">操作</td></tr>";
			$mymodal_tbody.append(single_table_title);
			for(var i = 0; i < q.n_option; i++){
				$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			}
			if(q.n_option==0){
				$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				$mymodal_tbody.find("input[id=\"option_index\"]").eq(i).val(option.index);
				if(option.option_type == 0){
					$mymodal_tbody.find("input[id=\"option_text\"]").eq(i).val(option.text);
				}
				else{
					$mymodal_tbody.find("input[id=\"image_fn\"]").eq(i).val(option.image);
					$mymodal_tbody.find("p[id=\"file_name\"]").eq(i).text("已选择"+option.image);
				}
				if(option.allow_filled == true){
					$mymodal_tbody.find("input[type=\"checkbox\"]").eq(i).prop('checked', true);
				}

			}
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append(condition_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 2:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
									+"<td class=\"text_col\">选项文字</td>"
									+"<td class=\"img_col\">图片</td>"
									+"<td class=\"fill_col\">允许填空</td>"
									+"<td class=\"op_col\">操作</td></tr>";
			$mymodal_tbody.append(single_table_title);
			for(var i = 0; i < q.n_option; i++){
				$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			}
			if(q.n_option==0){
				$mymodal_tbody.append("<tr>"+option_html+"</tr>");
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				$mymodal_tbody.find("input[id=\"option_index\"]").eq(i).val(option.index);
				if(option.option_type == 0){
					$mymodal_tbody.find("input[id=\"option_text\"]").eq(i).val(option.text);
				}
				else{
					$mymodal_tbody.find("input[id=\"image_fn\"]").eq(i).val(option.image);
					$mymodal_tbody.find("p[id=\"file_name\"]").eq(i).text("已选择"+option.image);
				}
				if(option.allow_filled == true){
					$mymodal_tbody.find("input[type=\"checkbox\"]").eq(i).prop('checked', true);
				}

			}
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			var condition_multi_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td>"+
			                           "<td id=\"jump_to\"><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td>"+
			                           "<td id=\"jump_from\"><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td>"+
			                           "<td id=\"min_select\">至少选<input type=\"text\" style=\"width:40px\">项</td>"+
			                           "<td id=\"max_select\">至多选<input type=\"text\" style=\"width:40px\">项</td><tr>";
			$mymodal_tbody.append(condition_multi_html);
			if(q.min_select != ""){
				$mymodal_tbody.find("#min_select").children("input[type=\"text\"]").val(q.min_select);
			}
			if(q.max_select != ""){
				$mymodal_tbody.find("#max_select").children("input[type=\"text\"]").val(q.max_select);
			}
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 3:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","conditions");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append(condition_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 4:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
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
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.empty();
			$mymodal_tbody.append("<tr><td class=\"text_col\">选项文字</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			for(var i = 0; i < q.n_option; i++){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			if(q.n_option==0){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				$('.option_text').eq(i).children().eq(0).children().eq(0).prop("value",option.text);
			}
			$mymodal_table.eq(3).attr("id","conditions");
			$mymodal_table.eq(3).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(3).children().eq(0);
			$mymodal_tbody.append(condition_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 5:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">选项文字</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			for(var i = 0; i < q.n_option; i++){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			if(q.n_option==0){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				$('.option_text').eq(i).children().eq(0).children().eq(0).prop("value",option.text);
			}
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			var condition_multi_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td>"+
			                           "<td id=\"jump_to\"><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td>"+
			                           "<td id=\"jump_from\"><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td>"+
			                           "<td id=\"min_select\">至少选<input type=\"text\" style=\"width:40px\">项</td>"+
			                           "<td id=\"max_select\">至多选<input type=\"text\" style=\"width:40px\">项</td><tr>";
			$mymodal_tbody.append(condition_multi_html);
			if(q.min_select != ""){
				$mymodal_tbody.find("#min_select").children("input[type=\"text\"]").val(q.min_select);
			}
			if(q.max_select != ""){
				$mymodal_tbody.find("#max_select").children("input[type=\"text\"]").val(q.max_select);
			}
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 6:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","options_row");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">行标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			var row_n = Number(q.n_set);
			var col_n = Number(q.n_option/q.n_set);
			for(var i = 0; i < row_n; i++){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			if(row_n == 0){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			for(var i = 0; i < row_n; i++){
				var option = q.options[i*col_n];
				$("#options_row").find('.option_text').eq(i).children().eq(0).children().eq(0).prop("value",option.text);
			}
			$mymodal_table.eq(2).attr("id","options_col");
			$mymodal_table.eq(2).addClass("table-striped");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">列标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			for(var i = 0; i < col_n; i++){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			if(col_n==0){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			for(var i = 0; i < col_n; i++){
				var option = q.options[i];
				$("#options_col").find('.option_text').eq(i).children().eq(0).children().eq(0).prop("value",option.image);
			}
			$mymodal_table.eq(3).attr("id","conditions");
			$mymodal_table.eq(3).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(3).children().eq(0);
			$mymodal_tbody.append(condition_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
		case 7:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html,table_html,table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			$mymodal_table.eq(1).attr("id","options");
			$mymodal_table.eq(1).addClass("table-striped");
			$mymodal_table.eq(1).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
			$mymodal_tbody.append("<tr><td class=\"text_col\">小标题</td>"
							+"<td class=\"op_col\">操作</td></tr>");
			for(var i = 0; i < q.n_option; i++){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			if(q.n_option==0){
				$mymodal_tbody.append("<tr class=\"option_text\">"+option_html_text+"</tr>");
			}
			for(var i = 0; i < q.n_option; i++){
				var option = q.options[i];
				$('.option_text').eq(i).children().eq(0).children().eq(0).prop("value",option.text);
			}
			$mymodal_table.eq(2).attr("id","conditions");
			$mymodal_table.eq(2).append("<tbody></tbody>");
			$mymodal_tbody = $mymodal_table.eq(2).children().eq(0);
			$mymodal_tbody.append(condition_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
			myNicEditor.setPanel('myNicPanel');
			myNicEditor.addInstance('s_title');
			break;
		}
		case 8:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(table_title_html);
			$("#s_title").html(q.title_html);
			var myNicEditor = new nicEditor({buttonList : ['fontFamily','fontSize','bold','italic','underline','strikeThrough','subscript','superscript','html','forecolor','bgcolor']});
		    myNicEditor.setPanel('myNicPanel');
		    myNicEditor.addInstance('s_title');
			break;
		}
	}
		if(q.must_answer == true){
			$mymodal_tbody.find("#must_answer").children().eq(0).prop("checked",true);
		}
		if(q.jump_to != false){
			$jump_to_html = $mymodal_tbody.find("#jump_to").children().eq(0);
			$jump_to_html.prop("checked",true);
			jump(1);
			$jump_to_html.parent().find("input[type=\"text\"]").val(q.jump_to);

		}
		if(q.jump_from != false){
			$jump_from_html = $mymodal_tbody.find("#jump_from").children().eq(0);
			$jump_from_html.prop("checked",true);
			jump(2);
			$jump_from_html.parent().find("input[type=\"text\"]").eq(0).val(q.jump_from[0]);
			$jump_from_html.parent().find("input[type=\"text\"]").eq(1).val(q.jump_from[1]);
		}
	operate_index = index+1;
}

function deleteQ(b){
	var $b = $(b);
	var index = $b.parents("tr").index();
	current_status.index --;
	q_table.deleteRow(index);
	var now_s_type = questions[index].s_type;
	questions.splice(index, 1);
	var rows = q_table.rows;
	if(now_s_type != 8){
		for(var i = index; i < questions.length; i ++)
		{
			questions[i].index --;
			rows[i].innerHTML = createHtml(questions[i]);
		}
	}
	operate_index = current_status.index;
}

function closeModal(){
	operate_index = current_status.index;
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
		if(current_status.action == 2){
			deleteQ($(q_table.rows[operate_index-1]).children("td"));
		}
		operate_index = current_status.index;
		return;
	}
	else{
		questions.splice(operate_index,0,q);
		var new_row = q_table.insertRow(operate_index);
		new_row.innerHTML = createHtml(q);
		var rows = q_table.rows;
		if(q.s_type != 8){
			for(var i = operate_index+1; i < questions.length; i ++)
			{
				questions[i].index ++;
				rows[i].innerHTML = createHtml(questions[i]);
			}
		}
		if(current_status.action == 2){
			deleteQ($(q_table.rows[operate_index-1]).children("td"));
		}
		current_status.index ++;
		operate_index = current_status.index;
		return;
	}
}

function createPage(){
	for(var i = 0; i < questions.length; i++){
		var new_row = q_table.insertRow(-1);
		new_row.innerHTML = createHtml(questions[i]);
	}

}

function addOption(b)
{
	var $b = $(b);
	var index = $b.parents("tr").index();
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
		$b.parents("table").find("input[id=\"option_index\"]").eq(index).val(String.fromCharCode(65 +index));
	}
}
function delOption(b)
{
	var current_row = b.parentNode.parentNode;
	var current_index = current_row.rowIndex;
	var op_table = b.parentNode.parentNode.parentNode;
	if(current_index == 1 && op_table.rows.length == 2)
	{
		alert("至少一个选项！");
		return;
	}
	op_table.deleteRow(current_index);
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
        		x.parentNode.children[1].value = '/' + returndata.url;
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
