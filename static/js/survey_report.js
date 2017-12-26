var self_report_questions = new Array();
var self_q = '[{"s_type":7,"index":1,"title_html":"","guize_num":1,"guizes":[{"xize_num":1,"xizes":[{"yuansu":["0","1","5","7"],"caozuo":0,"fuhao":0,"duibizhi":"123"}],"content":"123123123"}]},{"s_type":8,"title_html":"我爱我家","guize_num":0},{"s_type":1,"index":0,"title_html":"","guize_num":1,"guizes":[{"xize_num":1,"xizes":[{"yuansu":["0","4","6"],"caozuo":0,"fuhao":0,"duibizhi":"123"}],"content":"<img src=\"/media/20171226123435-IMG_4329.JPG\" width=\"30%\" alt=\"\" />"}]}]'

function createModalHtml(q){
	var HTMLContent = "<td>";
	var index = q.index;
	HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title+"</font>";
	switch(q.s_type){
		case 1:{
			HTMLContent += "</div>";
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\""+option.text+"\" name=\"checkbox_name\"> "+option.index+". ";
				HTMLContent += option.text+"</p>";
				
			}
			HTMLContent += "</form></div>";
			break;
		}
		case 6:{
			HTMLContent += "</div>";
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\""+option.text+"\" name=\"checkbox_name\"> "+option.index+". ";
				HTMLContent += option.text+"&nbsp;\&\&&nbsp;"+option.image+"</p>";
				
			}
			HTMLContent += "</form></div>";
			break;
		}
		case 7:{
			HTMLContent += "</div>";
			HTMLContent += "<div><form>";
			for(var i = 0; i < q.n_option; i ++)
			{
				var option = q.options[i];
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\""+option.text+"\" name=\"checkbox_name\"> "+option.index+". ";
				HTMLContent += option.text+"</p>";
				
			}
			HTMLContent += "</form></div>";
			break;
		}
	}
	HTMLContent += "<br/>性别<br/>"
	HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"男\" name=\"checkbox_name\">男</p>";	
	HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"女\" name=\"checkbox_name\">女</p>";
	HTMLContent += "<br/>学历<br/>"
	HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"博士\" name=\"checkbox_name\">博士</p>";	
	HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"硕士\" name=\"checkbox_name\">硕士</p>";	
	HTMLContent += "</td>";
	return HTMLContent;
}

function createRHtml(rq){
	var HTMLContent = "<td>";
	if(rq.s_type == 8){
		HTMLContent += "<div style=\"width:100%;\">" +rq.title_html + "</div>";
	}
	if(rq.s_type != 8){
		for(var i = 0; i < rq.guize_num; i++){
			HTMLContent += "<div style=\"width:100%;\">[规则&nbsp;"+(i+1)+ "]<br/>";
			HTMLContent += rq.guizes[i].content;
			HTMLContent += "</div>"
		}
	}
	HTMLContent += "<br><div><button class=\"btn btn-danger btn-sm\" onclick=\"deleteRQ(this)\">删除";
	HTMLContent += "<button class=\"btn btn-success btn-sm\" onclick=\"moveRQup(this)\">上移</button><button class=\"btn btn-success btn-sm\" onclick=\"moveRQdown(this)\">下移</button></div><hr>";
	HTMLContent += "</td>";
	return HTMLContent;
}

function deleteRQ(b){
	var $b = $(b);
	$b.parents("tr").remove();
}

function moveRQup(b){
	var $b = $(b);
	var $tr = $b.parents("tr").eq(0);
	if ($tr.index() != 0) {
		$tr.prev().before($tr);
	}
}


function moveRQdown(b){
	var $b = $(b);
	var $tr = $b.parents("tr").eq(0);
	if ($tr.index() != $("#questions").find("tr").length-1) {
		$tr.next().after($tr);
	}
}

function putIn(b){
	$b = $(b);
	var length = $("#myModal_body").find("input[name=\"checkbox_name\"]").length;
	if(length == 0) return;
	for(var i = 0; i < length; i++){
		var checkbox_now = $("#myModal_body").find("input[name=\"checkbox_name\"]").eq(i);
		
		if(checkbox_now.prop("checked")){
			var HTMLContent = "<p class=\""+i+"\" style=\"margin:0;padding:0;\">"+checkbox_now.attr("content")+"</p>";
			
			$b.parents("tr").eq(0).find(".guizeneirong").eq(0).append(HTMLContent);
		}
	}

}

function clearOut(b){
	$b = $(b);
	$b.parents("tr").eq(0).find(".guizeneirong").eq(0).empty();
}

function add_guize(b){
	$b = $(b);
	updateRadioName();
	var guize_table = $(".guize").find("table").eq(0).clone();
	
	guize_table.appendTo($(".guize_modal"));

	guize_table.find('td').last().children("textarea").attr("name","huodongneirong_bianji_"+bianji_list.length);
	var bianji_length = bianji_list.length
	bianji_list.push("huodongneirong_bianji_"+bianji_list.length);
	editor[bianji_length] = KindEditor.create('textarea[name="huodongneirong_bianji_'+bianji_length+'"]',options_2);

}

function del_guize(b){
	$b = $(b);
	updateRadioName();
	if($b.parents("div").eq(0).find("table").length==1){
		alert("至少一条记录!");
		return;
	}
	else{
		$(b).parents("table").eq(0).remove();
	}

}	

function showReport(user_is_staff,user_gender){
	//console.log(JSON.stringify(results));
	//console.log(user_is_staff);
	if(user_is_staff){
		module_select(0);
	}
	else{
		
	}
}



function createSelfReport(id){
	report_status.s_type = id;
	switch(id){
		case 0:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(report_title_html);
			editor_title = KindEditor.create('textarea[name="res_title"]',options); 
			break;
		}
		case 1:{
			$("#myModal_body").empty();
			$("#myModal_body").append("<h3>选择题目</h3>");
			var rep_select_html = "<div><select id=\"q_select\" onchange=\"select_onchange(this)\"><option value = \"\">--请选择--</option>";
			for(var i = 0; i < questions.length; i ++){
				var q = questions[i];
				if(q.s_type == 8){
					continue;
				}
				else{
					rep_select_html += "<option value=\""+i.toString()+"\">"+(q.index+1).toString()+". "+q.title+"</option>"
				}
			}
			rep_select_html += "</select></div>";
			$("#myModal_body").append(rep_select_html);
			$("#myModal_body").append(table_html); //原题展示
			var guize_div = $(".guize").clone();
			
			guize_div.attr("class","guize_modal");
			guize_div.find(".xize_tr").eq(0).attr("class","");
			guize_div.find("textarea").last().attr("name","huodongneirong_bianji_0");
			guize_div.show();
			guize_div.appendTo($("#myModal_body")); //规则组合
			editor[0] = KindEditor.create('textarea[name="'+bianji_list[0]+'"]',options_2);
			break;
		}
	}
	updateRadioName();

}

function select_onchange(b){
	$b = $(b);
	var q_id = $b.find("option:selected").val();
	var HTMLContent = createModalHtml(questions[q_id]);
	var original_q_table = $("#myModal_body").children(".table").eq(0);
	original_q_table.empty();
	original_q_table.append("<tr style=\"text-align:left;\">"+HTMLContent+"</tr>");
}




function updateReport(){
	report_content = $("#questions").html();
}

function updateRadioName(){
	var length = $(".guize_modal").find("table").length;
	for(var i = 0; i < length; i ++){
		var table = $(".guize_modal").find("table").eq(i);
		var xize_num = table.find("div.guizeneirong").length;
		for(var j = 0; j < xize_num; j++){
			var xize = table.find("div.guizeneirong").eq(j).parents("tr").eq(0);
			for(var k = 0; k < xize.find("input.caozuo").length; k++){
				xize.find("input.caozuo").eq(k).attr("name","caozuo_"+i+"_"+j);
			}
			for(var k = 0; k < xize.find("input.fuhao").length; k++){
				xize.find("input.fuhao").eq(k).attr("name","fuhao_"+i+"_"+j);
			}
		}

	}
}

function getRQFromModal(){
	if(report_status.s_type == 0){
		var rq = {s_type:8};
		rq.title_html = editor_title.html();
		rq.guize_num = 0;
		return rq;
	}
	else{
		var q_id = $("#q_select").find("option:selected").val();
		if(q_id == "") return {s_type:-1};
		var this_q = questions[q_id];
		var rq = {s_type:this_q.s_type, index:this_q.index};
		rq.title_html = "";
		var guize_num = $(".guize_modal").find("table").length;
		rq.guize_num = guize_num;
		rq.guizes = [];
		for(var i = 0; i < guize_num; i++){
			var guize = {};
			var table = $(".guize_modal").find("table").eq(i);
			var xize_num = table.find("div.guizeneirong").length;
			guize.xize_num = xize_num;
			guize.xizes = []
			for(var k = 0; k < xize_num; k++){
				var yuansu_length = table.find("div.guizeneirong").eq(k).find("p").length;
				var yuansu = [];
				var xize = {};
				for(var j = 0; j < yuansu_length; j++){
					yuansu.push(table.find("div.guizeneirong").eq(k).find("p").eq(j).attr("class"));
				}
				xize.yuansu = yuansu;
				xize.caozuo = -1;
				for(var j = 0; j < table.find("input[name=\"caozuo_"+i+"_"+k+"\"]").length; j++){
					if(table.find("input[name=\"caozuo_"+i+"_"+k+"\"]").eq(j).prop("checked") == true){
						xize.caozuo = j;
					}

				}
				xize.fuhao = -1;
				for(var j = 0; j < table.find("input[name=\"fuhao_"+i+"_"+k+"\"]").length; j++){
					if(table.find("input[name=\"fuhao_"+i+"_"+k+"\"]").eq(j).prop("checked") == true){
						xize.fuhao = j;
					}

				}
				xize.duibizhi = table.find("div.guizeneirong").eq(k).parents("tr").eq(0).find("textarea").last().val();
				guize.xizes.push(xize);
			}
			var editor_index = bianji_list.indexOf(table.find("textarea").last().attr("name"));
			guize.content = editor[editor_index].html();
			rq.guizes.push(guize);
		}
		return rq;
	}
	

}

function commitRS(){
	var rq = getRQFromModal();
	if(rq.s_type == -1){
		return;
	}
	$("#myModal").modal('hide');
	if(rq.s_type != 8){
		for(var i = 0; i < bianji_list.length; i++){
			editor[i].remove();
		}
	}
	else{
		editor_title.remove();
	}
	var new_row = q_table.insertRow(-1);
	new_row.innerHTML  = createRHtml(rq);
	report_status.index ++;
	updateReport();
	self_report_questions.push(rq);
}

function module_select(id){
	$("#questions").empty();
	$("#self_report_btn").hide();
	var length = $("#nav_1").children("li").length;
	for(var i = 0; i < length; i++){
		$("#chapter_"+i).parent().eq(0).attr("class","");
	}
	$("#chapter_"+id).parent().eq(0).attr("class","active");
	switch(id){
		case 0:{
			for(var i = 0; i < results.length; i ++){
				var new_row = q_table.insertRow(-1);
				var result = results[i];
				var new_html = createReportHtml(result);
				new_row.innerHTML = new_html;
			}
			break;
		}
		case 1:{
			$("#questions").html(report_content);
			$("#self_report_btn").show()
			break;
		}
	}
}

function addOption_2(b){
	var $b = $(b);
	var this_tr = $(".xize_tr").eq(0).clone();
	this_tr.attr("class","");
	this_tr.insertAfter($b.parents("tr").eq(0));
	updateRadioName();
}

function delOption_2(b){
	var $b = $(b);
	if($b.parents("table").eq(0).find("tr").length == 4){
		alert("至少一条记录!");
	}
	else{
		$b.parents("tr").eq(0).remove();
	}	
	updateRadioName();
}

function exportr(){
	var self_report_qstring = JSON.stringify(self_report_questions);
	//存到数据库
	console.log(self_report_qstring);
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'save_report_template', 'report_template': self_report_qstring},
		success: function(data) {
			var data = JSON.parse(data);
		}
	});
}



