var self_report_questions = new Array();
var now_page = "sr" //sr: selfreport; ar: allreport
var drag_previous_index = -1; //表格拖拽前tr位置
var drag_after_index = -1; //表格拖拽后tr位置
//var user_gender = 1;
//var user_student_type = 1;

//在modal中的题目样例
function createModalHtml(q,gender_student = 1){
	//flag: 0:all; 1:self(male,female; phd,master)
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
		case 2:{
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
		case 3:{
			HTMLContent += "</div>";
			HTMLContent += "<div><form>";
			HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"文本框\" name=\"checkbox_name\"> ";
			HTMLContent += "文本框</p>";
			HTMLContent += "</form></div>";
			break;
		}
		case 4:{
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
		case 5:{
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
	if(gender_student == 1){
		HTMLContent += "<br/>性别<br/>"
		HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"男\" name=\"checkbox_name\">男</p>";	
		HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"女\" name=\"checkbox_name\">女</p>";
		HTMLContent += "<br/>学历<br/>"
		HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"硕士\" name=\"checkbox_name\">硕士</p>";	
		HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" content=\"博士\" name=\"checkbox_name\">博士</p>";	
		HTMLContent += "</td>";
	}
	return HTMLContent;
}

var radar_flag = false;
//在管理员编辑个人报告的页面显示，有删除，上下移动的操作。
function createRHtml(rq){
	radar_flag = false;
	var HTMLContent = "<td>";
	if(rq.s_type == 8){
		HTMLContent += "<div style=\"width:100%;\">" +rq.title_html + "</div>";
	}
	if((rq.s_type != 8) && (rq.s_type != 9)){
		for(var i = 0; i < rq.guize_num; i++){
			HTMLContent += "<div style=\"width:100%;\">[规则&nbsp;"+(i+1)+ "]<br/>";
			//console.log(rq.guizes[i].content.indexOf("radar"));
			HTMLContent += rq.guizes[i].content;
			if(rq.guizes[i].content.indexOf("radar") != -1){
				radar_list.push("radar");
				radar_flag = true;
				//console.log($(rq.guizes[i].content).attr("id"));
				//drawRadar($(rq.guizes[i].content).attr("id"),[],[]);
			}
			HTMLContent += "</div>"
		}
	}
	if(rq.s_type == 9){
		HTMLContent += "";
	}
	
	HTMLContent += "<br><div><button class=\"btn btn-danger btn-sm\" onclick=\"deleteRQ(this)\">删除";
	HTMLContent += "<button class=\"btn btn-success btn-sm\" onclick=\"moveRQup(this)\">上移</button><button class=\"btn btn-success btn-sm\" onclick=\"moveRQdown(this)\">下移</button></div><hr>";
	
	HTMLContent += "</td>";
	return HTMLContent;
}

function drawRadars(rq){
	//console.log("in!");
	//console.log(JSON.stringify(rq));
	//console.log(JSON.stringify(questions[rq.index]));
	//console.log(JSON.stringify(answers_from_database[rq.index]));
	//console.log(JSON.stringify(results[rq.index]));
	var q = questions[rq.index];
	var q_options = q.options;
	var a_select = answers_from_database[rq.index].select;
	var r_options = results[rq.index].options;
	for(var i = 0; i < rq.guize_num; i++){
		if(rq.guizes[i].content.indexOf("radar") != -1){
			//console.log($(rq.guizes[i].content).attr("id"));
			//var groups = new Array();
			var zuobiao = [];
			var your_ave = [];
			var all_ave = [];
			var xize_num = rq.guizes[i].xize_num;
			for(var j = 0; j < xize_num; j++){
				var your_score = 0.0;
				var all_score = 0.0;
				var valid_num = 0;
				var xize = rq.guizes[i].xizes[j];
				var yuansu = xize.yuansu;
				var group = [];
				for(var k = 0; k < yuansu.length; k ++){
					if(group.indexOf(q_options[parseInt(yuansu[k])].text) == -1){
						group.push(q_options[parseInt(yuansu[k])].text);
						var hanghao = Math.floor(parseInt(yuansu[k])/q.n_set);
						valid_num += 1;
						for(var r_index = 0; r_index < r_options.length; r_index++){
							if(q_options[parseInt(yuansu[k])].text == r_options[r_index].text){
								all_score += r_options[r_index].ratio * get_score(q_options,r_options[r_index].image);
								
							}
						}
						if(user_is_staff){
							your_score += 0;		
						}
						else{
							your_score += get_score(q_options,a_select[hanghao][3]);
						}
						
					}
				}
				if(user_is_staff){
					your_score = all_score;
				}

				your_score = your_score / valid_num;
				all_score = all_score / valid_num;
				your_ave.push(Math.round((your_score+1)*100)/100);
				all_ave.push(Math.round((all_score+1)*100)/100);
				//console.log(all_ave);
				//console.log(all_score);
				//groups.push(group);
				zuobiao.push(xize.leidazuobiao);
				
			}

			//console.log(zuobiao);
			//console.log(your_ave);
			//console.log(all_ave);
			drawRadar($(rq.guizes[i].content).attr("id"),zuobiao,all_ave,your_ave);
		}
	}
}

function get_score(q_options,col_name){
	var score = -1;
	for(var i = 0; i < q_options.length; i++){
		if(q_options[i].image == col_name){
			score = i;
			break;
		}
	}
	return score;
}

function swap_self_report_questions(i,j){
	
	var temp = self_report_questions[i];
	self_report_questions[i] = self_report_questions[j];
	self_report_questions[j] = temp;
}

function deleteRQ(b){
	var $b = $(b);
	var $tr = $b.parents("tr").eq(0);
	self_report_questions.splice($tr.index(),1);
	$tr.remove();
}

function moveRQup(b){
	var $b = $(b);
	var $tr = $b.parents("tr").eq(0);
	if ($tr.index() != 0) {
		swap_self_report_questions($tr.index(),$tr.index()-1);
		$tr.prev().before($tr);
	}
}


function moveRQdown(b){
	var $b = $(b);
	var $tr = $b.parents("tr").eq(0);
	if ($tr.index() != $("#questions").find("tr").length-1) {
		swap_self_report_questions($tr.index(),$tr.index()+1);
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
	var guize_table = $(".guize").find("table").eq(0).clone();
	
	guize_table.appendTo($(".guize_modal"));

	guize_table.find('td').last().children("textarea").attr("name","huodongneirong_bianji_"+bianji_list.length);
	var bianji_length = bianji_list.length
	bianji_list.push("huodongneirong_bianji_"+bianji_list.length);
	editor[bianji_length] = KindEditor.create('textarea[name="huodongneirong_bianji_'+bianji_length+'"]',options_2);
	updateRadioName();

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
	//drawRadar("radar_test",[],[]);
	if(user_is_staff){
		module_select(1);
	}
	else{
		if(situation == 3){
			module_select_user(1);
		}
		else if(situation == 2){
			showPage();
			getindex();
			fillAnswer();
		}
	}
}

function module_select_user(id){
	$("#questions").empty();
	var length = $("#nav_2").children("li").length;
	for(var i = 0; i < length; i++){
		$("#chapter_user_"+i).parent().eq(0).attr("class","");
	}
	$("#chapter_user_"+id).parent().eq(0).attr("class","active");
	switch(id){
		case 0:{
			showPage();
			getindex();
			fillAnswer();
			break;
		}
		case 1:{
			showSelfReport();
			break;
		}
	}
}


//在管理员编辑个人报告模板时的弹出框
function createSelfReport(id){
	report_status.s_type = id;
	tableDragable();
	switch(id){
		case 0:{
			$("#myModal_body").empty();
			$("#myModal_body").append(table_html);
			var $mymodal_table = $("#myModal_body").children(".table");
			$mymodal_table.eq(0).append(report_title_html);
			editor_title = KindEditor.create('textarea[name="res_title"]',options_2); 
			break;
		}
		case 1:{
			$("#myModal_body").empty();
			$("#myModal_body").append("<h4>说明：先选择题目，勾选题目下所需选项，点击加入规则后进行操作。其中填空题可以选择计算操作，其他题型为选中操作。</h4>");
			$("#myModal_body").append("<h3>选择题目</h3>");
			var rep_select_html = "<div><select id=\"q_select\" onchange=\"select_onchange(this,1)\"><option value = \"\">--请选择--</option>";
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
		case 2:{
			$("#myModal_body").empty();
			$("#myModal_body").append("<h4>说明：先选择题目，勾选题目下所需选项，并选择展示图表，提供预览。</h4>");
			$("#myModal_body").append("<h3>选择题目</h3>");
			var rep_select_html = "<div><select id=\"q_select\" onchange=\"select_onchange(this,0)\"><option value = \"\">--请选择--</option>";
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
			break;
		}
	}
	updateRadioName();

}

function select_onchange(b,flag){
	//flag: 0: all; 1: self(male, female, Ph.d., Master)
	if(flag == 0){
		$b = $(b);
		var r_id = $b.find("option:selected").val();
		var HTMLContent = createReportHtml(results[r_id]);
		var original_q_table = $("#myModal_body").children(".table").eq(0);
		original_q_table.empty();
		original_q_table.append("<tr style=\"text-align:left;\">"+HTMLContent+"</tr>");
	}
	if(flag == 1){
		$b = $(b);
		var q_id = $b.find("option:selected").val();
		var HTMLContent = createModalHtml(questions[q_id]);
		var original_q_table = $("#myModal_body").children(".table").eq(0);
		original_q_table.empty();
		original_q_table.append("<tr style=\"text-align:left;\">"+HTMLContent+"</tr>");
	}

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
		var zhanshifangshi = table.find("tr").last();
		for(var k = 0; k < zhanshifangshi.find("input.zhanshi").length; k++){
			zhanshifangshi.find("input.zhanshi").eq(k).attr("name","zhanshi_"+i);
		}

	}
}

var radar_list = [];

function getRQFromModal(){
	//console.log(report_status.s_type);
	if(report_status.s_type == 0){ //添加描述
		var rq = {s_type:8};
		rq.title_html = editor_title.html();
		rq.guize_num = 0;
		return rq;
	}
	else if(report_status.s_type == 2){ //添加总体情况图表
		if($("div#canvassr0").length == 0){
			return {s_type:-1};
		}
		var rq = {s_type:9};
		//哪一种图表（图表名称）
		rq.title_html = $("div#myModal_body").find("div#canvassr0").prop("class");
		//哪一题
		rq.index = $("div#myModal_body").children("div").eq(0).children("select").eq(0).find("option:selected").val();
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
				xize.duibizhi = table.find("div.guizeneirong").eq(k).parents("tr").eq(0).find("textarea").eq(0).val();
				xize.leidazuobiao = table.find("div.guizeneirong").eq(k).parents("tr").eq(0).find("textarea").last().val();
				
				guize.xizes.push(xize);
			}

			var editor_index = bianji_list.indexOf(table.find("textarea").last().attr("name"));
			var zhanshifangshi = table.find("tr").last();

			
			if(zhanshifangshi.find("input[name=\"zhanshi_"+i+"\"]").eq(0).prop("checked") == true){
				guize.content = editor[editor_index].html();
			}
			else{
				var unique_num = radar_list.length;
				guize.content = "<div id=\"radar_"+unique_num+"\" style=\"width: 600px;height:400px;margin:0 100px 0 100px\"></div>";
				radar_list.push("radar_"+unique_num);
			}
			rq.guizes.push(guize);
		}
		return rq;
	}
	
}

function drawGraphs(b,rq){
	var $b = $(b);
	var temp = $b.children("td").eq(0).children("div").eq(0);
	if(temp.length == 0){
		$b.children("td").eq(0).append("<div></div>");
		temp = $b.children("td").eq(0).children("div").eq(0);
	}
	switch(rq.title_html){
		case "doughnut":{
			doughnut(temp,rq);
			break;
		}
		case "bar":{
			bar(temp,rq);
			break;
		}
		case "Hbar":{
			Hbar(temp,rq);
			break;
		}
		case "Mbar":{
			Mbar(temp,rq);
			break;
		}
		case "Sbar":{
			Sbar(temp,rq);
			break;
		}

	}

}

function commitRS(){
	var rq = getRQFromModal();
	if(rq.s_type == -1){
		return;
	}
	$("#myModal").modal('hide');
	if(rq.s_type != 9){
		if(rq.s_type != 8){
			for(var i = 0; i < bianji_list.length; i++){
				editor[i].remove();
			}
		}
		else{
			editor_title.remove();
		}
	}
	var new_row = q_table.insertRow(-1);
	new_row.innerHTML  = createRHtml(rq);
	if(radar_flag) drawRadars(rq);
	if(rq.s_type == 9){
		drawGraphs($(new_row),rq);
	}
	report_status.index ++;
	updateReport();
	self_report_questions.push(rq);
}

function module_select(id){
	$("#questions").empty();
	$("#self_report_btn").hide();
	$("#export_btn").hide();
	$("#saveSr_btn").hide();
	$("#exportSr_btn").hide();
	$("#preview_btn").hide();
	var length = $("#nav_1").children("li").length;
	for(var i = 0; i < length; i++){
		$("#chapter_"+i).parent().eq(0).attr("class","");
	}
	$("#chapter_"+id).parent().eq(0).attr("class","active");
	switch(id){
		case 0:{
			now_page = "ar";
			for(var i = 0; i < results.length; i ++){
				var new_row = q_table.insertRow(-1);
				var result = results[i];
				var new_html = createReportHtml(result);
				new_row.innerHTML = new_html;
				$("#export_btn").show();
			}
			break;
		}
		case 1:{
			now_page = "sr";
			$("#self_report_btn").show();
			if(situation == 2){
				$("#saveSr_btn").show();
				$("#exportSr_btn").show();
			}
			if(situation == 3){
				$("#saveSr_btn").text("修改个人报告");
			}
			$("#saveSr_btn").show();
			$("#preview_btn").show();
			if(report_template == "") break;
			self_report_questions = JSON.parse(report_template);
			for(var i = 0; i < self_report_questions.length; i ++){
				var rq = self_report_questions[i];
				var new_row = q_table.insertRow(-1);
				new_row.innerHTML  = createRHtml(rq);
				if(radar_flag) drawRadars(rq);
				if(rq.s_type == 9){
					drawGraphs($(new_row),rq);
				}
				report_status.index ++;
			}
		    tableDragable();
		    var imgs = $("img");
		    if(IsPC()){
		    	for(var i = 0; i < imgs.length; i++){
					var img = imgs.eq(i).attr("width","60%");
				}
		    }
		    else{
		    	for(var i = 0; i < imgs.length; i++){
					var img = imgs.eq(i).attr("width","90%");
				}
		    }
			break;
		}
	}
}

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

var fixHelper = function(e, ui) {  
   //console.log(ui)   
    ui.children().each(function() {  
        $(this).width($(this).width());     //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了   
    });  
    return ui;  
};  

function reorderTrContent(pindex,nindex){
	if(pindex == -1 || nindex == -1){
		return;
	}
	
	if(pindex < nindex){
		for(var i = pindex; i < nindex; i++){
			swap_self_report_questions(i,i+1);
		}
	}
	else if(pindex > nindex){
		for(var i = pindex; i > nindex; i--){
			swap_self_report_questions(i,i-1);
		}
	}

}
           
function tableDragable(){
    $("#questions tbody").sortable({                //这里是talbe tbody，绑定 了sortable   
        helper: fixHelper,                  //调用fixHelper   
        axis:"y",  
        start:function(e, ui){  
        	drag_previous_index = ui.item.index();
        	return ui;  
        },  
        stop:function(e, ui){
        	drag_after_index = ui.item.index();
        	reorderTrContent(drag_previous_index,drag_after_index); 
        	return ui;                  
        }  
    }).disableSelection();  
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

function saveSr(){
	var self_report_qstring = JSON.stringify(self_report_questions);
	//存到数据库
	console.log(self_report_qstring);
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'save_report_template', 'report_template': self_report_qstring},
		success: function(data) {
			var data = JSON.parse(data);
			alert("保存成功");
			window.location.reload();
		}
	});
}

function exportSr() {
	var self_report_qstring = JSON.stringify(self_report_questions);
	
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'release_report', 'report_template': self_report_qstring},
		success: function(data) {
			var data = JSON.parse(data);
			alert("发布成功");

			window.location.reload();
		}
	});
}

function withdraw_report() {
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {'op': 'withdraw_report'},
		success: function(data) {
			var data = JSON.parse(data);
			alert("撤回成功");
			window.location.reload();
		}
	});
}

//选择该规则下展示内容：自定义、雷达图
function wayToShow(b){
	$b = $(b);
	var editor_index = bianji_list.indexOf($b.parents("tr").eq(0).find("textarea").last().attr("name"));
	var this_editor = editor[editor_index]; 
	if($b.attr("content") == "zidingyi"){
		this_editor.readonly(false);
	}
	if($b.attr("content") == "leidatu"){
		this_editor.readonly(true);
	}
}


function createSRHtml(self_rq){
	//self_rq 模板; answer 用户答案; question 原问题；
	var HTMLContent = "<td>"; 
	HTMLContent += "<div style=\"100%\">";
	if(self_rq.s_type != 8){
		var q_index = self_rq.index;
		var answer = answers_from_database[q_index];
		var question = questions[q_index];
	}
	radar_flag = false;
	switch(self_rq.s_type){
		case 1:{ //单选
			//console.log(JSON.stringify(answer));
			//console.log(JSON.stringify(question));
			//console.log(JSON.stringify(self_rq));
			var select_answer = answer.select[0][0];
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					for(var k = 0; k < xize.yuansu.length; k++){
						var yuan = parseInt(xize.yuansu[k]);
						if(yuan > a_length - 1){
							if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
								flag = false;
							}
						}
						else{
							if(select_answer != yuan){
								flag = false;
							}
						}
					}
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 2:{ //多选
			var select_answer = [];
			for(var i = 0; i < answer.select.length; i++){
				select_answer.push(answer.select[i][0]);
			}
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					for(var k = 0; k < xize.yuansu.length; k++){
						var yuan = parseInt(xize.yuansu[k]);
						if(yuan > a_length - 1){
							if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
								flag = false;
							}
						}
						else{
							if(select_answer.indexOf(yuan) == -1){
								flag = false;
							}
						}
					}
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 4:{ //下拉单选
			//console.log(JSON.stringify(answer));
			//console.log(JSON.stringify(question));
			//console.log(JSON.stringify(self_rq));
			var select_answer = answer.select[0][0];
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					for(var k = 0; k < xize.yuansu.length; k++){
						var yuan = parseInt(xize.yuansu[k]);
						if(yuan > a_length - 1){
							if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
								flag = false;
							}
						}
						else{
							if(select_answer != yuan){
								flag = false;
							}
						}
					}
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 5:{
			//排序题
			//console.log(JSON.stringify(answer));
			//console.log(JSON.stringify(question));
			//console.log(JSON.stringify(self_rq));
			var select_answer = answer.select[0][0];
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					for(var k = 0; k < xize.yuansu.length; k++){
						var yuan = parseInt(xize.yuansu[k]);
						if(yuan > a_length - 1){
							if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
								flag = false;
							}
						}
						else{
							if(select_answer != yuan){
								flag = false;
							}
						}
					}
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 6:{
			//矩阵题
			var select_answer = [];
			for(var i = 0; i < answer.select.length; i++){
				select_answer.push(answer.select[i][0]);
			}
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				if(guize.content.indexOf("radar") != -1){
					radar_list.push("radar");
					radar_flag = true;
				}
				if(radar_flag){
					HTMLContent += guize.content;
					break;
				}
				else{
					for(var j = 0; j < guize.xize_num; j++){
						var xize = guize.xizes[j];
						for(var k = 0; k < xize.yuansu.length; k++){
							var yuan = parseInt(xize.yuansu[k]);
							if(yuan > a_length - 1){
								if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
									flag = false;
								}
							}
							else{
								if(select_answer.indexOf(yuan) == -1){
									flag = false;
								}
							}
						}
					}
					if(flag){
						right_guize = i;
						HTMLContent += guize.content;
						break;
					}
				}
			}
			break;
		}
		case 3:{
			//单项填空题
			var a_length = 1;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					var caozuo = xize.caozuo;
					var fuhao = xize.fuhao;
					var duibizhi = parseInt(xize.duibizhi);
					if(xize.caozuo == 0){ //选中性别 学历
						for(var k = 0; k < xize.yuansu.length; k++){
							var yuan = parseInt(xize.yuansu[k]);
							if(yuan > a_length - 1){
								if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
									flag = false;
								}
							}
							else{
								var result = parseInt(answer.select[yuan][2]);
								var valid = judgeResult(result,fuhao,duibizhi);
								if(!valid) flag = false;
							}
						}
					}
					
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 7:{
			var a_length = question.n_option;
			var right_guize = -1;
			for(var i = 0; i < self_rq.guize_num; i++){
				var guize = self_rq.guizes[i];
				var flag = true;
				for(var j = 0; j < guize.xize_num; j++){
					var xize = guize.xizes[j];
					var caozuo = xize.caozuo;
					var fuhao = xize.fuhao;
					var duibizhi = parseInt(xize.duibizhi);
					if(xize.caozuo == 0){ //选中性别 学历
						for(var k = 0; k < xize.yuansu.length; k++){
							var yuan = parseInt(xize.yuansu[k]);
							if(yuan > a_length - 1){
								if(((user_gender+a_length-1) != yuan) && ((user_student_type +a_length+1)!=yuan)){
									flag = false;
								}
							}
						}
					}
					else{ //进行求和等操作
						var count_arr = [];
						for(var k = 0; k < xize.yuansu.length; k++){
							var yuan = parseInt(xize.yuansu[k]);
							count_arr.push(parseInt(answer.select[yuan][2]));
						}
						var result = calArr(caozuo,count_arr);
						var valid = judgeResult(result,fuhao,duibizhi);
						if(!valid) flag = false;
					}
					
				}
				if(flag){
					right_guize = i;
					HTMLContent += guize.content;
					break;
				}
			}
			break;
		}
		case 8:{
			HTMLContent += self_rq.title_html;
			break;
		}
	}
	HTMLContent += "</div>";
	HTMLContent += "</td>";
	return HTMLContent;
}

//在不同符号下，判断求得的值是否相对于对比值合法
function judgeResult(result,fuhao,duibizhi){
	switch(fuhao){
		case 0:{
			if(result > duibizhi){
				return true;
			}
			break;
		}
		case 1:{
			if(result = duibizhi){
				return true;
			}
			break;
		}
		case 2:{
			if(result < duibizhi){
				return true;
			}
			break;
		}
		case 3:{
			if(result <= duibizhi){
				return true;
			}
			break;
		}
		case 4:{
			if(result >= duibizhi){
				return true;
			}
			break;
		}
	}
	return false;
}

//计算求和，平均，成绩的结果
function calArr(caozuo,count_arr){
	var result = 0;
	switch(caozuo){
		case 1:{
			for(var i = 0; i < count_arr.length; i++){
				result += count_arr[i];
			}
			break;
		}
		case 2:{
			for(var i = 0; i < count_arr.length; i++){
				result += count_arr[i];
			}
			result = result *1.0/ count_arr.length;
			break;
		}
		case 3:{
			result = 1;
			for(var i = 0; i < count_arr.length; i++){
				result *= count_arr[i];
			}
			break;
		}
	}
	return result;

}


function clean_QandA(){
	var new_questions = new Array();
	var new_answers = new Array();
	var new_results = new Array();
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
		if(q.s_type != 8){
			new_questions.push(q);
		}
	}
	questions = new_questions;
	for(var i = 0; i < answers_from_database.length; i++){
		var a = answers_from_database[i];
		if(a.s_type != 8){
			new_answers.push(a);
		}
	}
	answers_from_database = new_answers;
	for(var i = 0; i < results.length; i++){
		var r = results[i];
		if(r.s_type != 8){
			new_results.push(r);
		}
	}
	results = new_results;


}

function showSelfReport(){
	if(report_template == "") return;
	self_report_questions = JSON.parse(report_template);
	for(var i = 0; i < self_report_questions.length; i++){
		var self_rq = self_report_questions[i];
		
		var new_row = q_table.insertRow(-1);
		new_row.innerHTML  = createSRHtml(self_rq);
		if(radar_flag) drawRadars(self_rq);
		if(self_rq.s_type == 9){
			drawGraphs($(new_row),self_rq);
		}
		report_status.index ++;
	}
	var imgs = $("img");
	if(IsPC()){
    	for(var i = 0; i < imgs.length; i++){
			var img = imgs.eq(i).attr("width","60%");
		}
    }
    else{
    	for(var i = 0; i < imgs.length; i++){
			var img = imgs.eq(i).attr("width","90%");
		}
    }
}

//预览部分函数开始
function previewShow(){

}

function preview(){
	/*
	$("#myModal_body").empty();
	$("#myModalLabel").text("个人报告预览");
	$(".modal-footer").children("button").eq(1).hide();
	$(".modal-footer").children("button").eq(2).show();
	$("#myModal_body").append("<table></table>");
	var $table = $("#myModal_body").children("table").eq(0);
	var answers_from_database_copy = JSON.parse(JSON.stringify(answers_from_database));
	console.log(JSON.stringify(answers_from_database_copy))
	for(var i = 0; i < self_report_questions.length; i ++){
		now_report = self_report_questions[i];
		var index = now_report.index;
		var HTMLContent = createModalHtml(questions[index],-1);
		$table.append("<tr style=\"text-align:left;\">"+HTMLContent+"</tr>");
	}
	*/

}
//预览部分函数结束
