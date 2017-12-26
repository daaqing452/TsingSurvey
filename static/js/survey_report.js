function createRHtml(q){
	var HTMLContent = "<td>";
	var index = q.index;
	if(q.s_type == 8){
		HTMLContent += "<div><font size=\"3\">"+ q.title_html+"</font></div>";
	}
	else{
		HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title+"</font>";
	}
	switch(q.s_type){
		case 1:{
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
				HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\""+option.text+"\" name=\"checkbox_name\"> "+option.index+". ";
				HTMLContent += option.text+"</p>";
				
			}
			HTMLContent += "</form></div>";
			break;
		}
	}
	HTMLContent += "</td>";
	return HTMLContent;
}

function putIn(b){
	$b = $(b);
	var length = $("#myModal_body").find("input[name=\"checkbox_name\"]").length;
	if(length == 0) return;
	for(var i = 0; i < length; i++){
		var checkbox_now = $("#myModal_body").find("input[name=\"checkbox_name\"]").eq(i);
		console.log(checkbox_now.prop("checked"));
		if(checkbox_now.prop("checked")){
			var HTMLContent = "<p class=\""+i+"\" style=\"margin:0;padding:0;\">"+i+". "+checkbox_now.attr("content")+"</p>";
			
			$b.parents("table").eq(0).find(".guizeneirong").eq(0).append(HTMLContent);
		}
	}

}

function clearOut(b){

}

function add_guize(b){
	$b = $(b);
	var guize_table = $(".guize").find("table").eq(0).clone();
	console.log(guize_table);
	guize_table.appendTo($(".guize_modal"));

	guize_table.find('td').last().children("textarea").attr("name","huodongneirong_bianji_"+bianji_list.length);
	var bianji_length = bianji_list.length
	bianji_list.push("huodongneirong_bianji_"+bianji_list.length);
	editor[bianji_length] = KindEditor.create('textarea[name="huodongneirong_bianji_'+bianji_length+'"]',options);

}

function del_guize(b){
	$b = $(b);
	if($b.parents("div").eq(0).find("table").length==1){
		alert("至少一条记录!");
		return;
	}
	else{
		$(b).parents("table").eq(0).remove();
	}

}	

function showReport(user_is_staff){
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
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(report_title_html);
			editor_title = KindEditor.create('textarea[name="res_title"]',options);
			$("#myModal_body").append("<h3>选择题目</h3>");
			var rep_select_html = "<div><select id=\"q_select\" onchange=\"select_onchange(this)\"><option value = \"\">--请选择--</option>";
			for(var i = 0; i < results.length; i ++){
				var result = results[i];
				if(result.s_type == 8){
					continue;
				}
				else{
					rep_select_html += "<option value=\""+i.toString()+"\">"+(i+1).toString()+". "+result.title+"</option>"
				}
			}
			rep_select_html += "</select></div>";
			$("#myModal_body").append(rep_select_html);
			$("#myModal_body").append(table_html); //原题展示
			var guize_div = $(".guize").clone();
			console.log(guize_div);
			guize_div.attr("class","guize_modal");
			guize_div.find("textarea").last().attr("name","huodongneirong_bianji_0");
			guize_div.show();
			guize_div.appendTo($("#myModal_body")); //规则组合
			editor[0] = KindEditor.create('textarea[name="'+bianji_list[0]+'"]',options);
			break;
		}
	}


}

function select_onchange(b){
	$b = $(b);
	var result_id = $b.find("option:selected").val();
	var HTMLContent = createRHtml(results[result_id]);
	var original_q_table = $("#myModal_body").children(".table").eq(1);
	original_q_table.empty();
	original_q_table.append("<tr style=\"text-align:left;\">"+HTMLContent+"</tr>");
}

function createRHTML(content){
	var HTMLContent = "<td>";
	switch(report_status.s_type){
		case 0:{
			HTMLContent += "<div>" + content +"</div>";
			break;
		}
		case 1:{

			break;
		}
	}
	HTMLContent += "</td>";
	return HTMLContent;
}

function updateReport(){
	report_content = $("#questions").html();
}

function commitRS(){
	$("#myModal").modal('hide');
	switch(report_status.s_type){
		case 0:{
			var textarea_content = editor_title.html();
			var new_row = q_table.insertRow(-1);
			new_row.innerHTML  = createRHTML(textarea_content);
			console.log(textarea_content);
			report_status.index ++;
			updateReport();
			break;
		}
		case 1:{
			break;
		}
	}
	$('textarea[name="res_title"]').val("");
	editor_title.remove();
	for(var i = 0; i < bianji_list.length; i++){
		editor[i].remove();
	
	}
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
	var this_tr = $b.parents("tr").eq(0).clone();
	this_tr.insertAfter($b.parents("tr").eq(0));
}

function delOption_2(b){
	var $b = $(b);
	if($b.parents("table").eq(0).find("tr").length == 4){
		alert("至少一条记录!");
	}
	else{
		$b.parents("tr").eq(0).remove();
	}	
}



