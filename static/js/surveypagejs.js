var questions = {};
var answers = new Array();
$(document).ready(function(){ 
	//put string from database into Qstring
	var Qstring = "[{\"s_type\":1,\"title\":\"你所在的班级\",\"n_option\":5,\"options\":[{\"text\":\"计21\",\"image\":\"\"},{\"text\":\"计22\",\"image\":\"\"},{\"text\":\"计23\",\"image\":\"\"},{\"text\":\"计24\",\"image\":\"\"},{\"text\":\"计25\",\"image\":\"\"}]},{\"s_type\":2,\"title\":\"你喜欢的明星\",\"n_option\":3,\"options\":[{\"text\":\"科比\",\"image\":\"\"},{\"text\":\"乔丹\",\"image\":\"\"},{\"text\":\"周杰伦\",\"image\":\"\"}]},{\"s_type\":3,\"title\":\"你对于这个网页的看法\"}]"
	questions = JSON.parse(Qstring); 
	var q_table = document.getElementById("questions");
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
		switch(q.s_type){
			case 1:{
				var new_row = q_table.insertRow(-1);
				HTMLContent = "";
				HTMLContent += "<td id=\"Q_"+i.toString()+"\"><p>" +(i+1).toString()+". "+ q.title + "</p>";
				HTMLContent += "<form>";
				var options = q.options;
				for(var j = 0; j < q.n_option; j++){
					var option = options[j];
					HTMLContent += "<p><input type=\"radio\" name=\"single\" "
									+ "id=\"Q_"+i.toString()+"_"+j.toString() +"\" "
									+ "value=\""+ j.toString()+ "\">"
									+ String.fromCharCode(j + 65)
									+ ". " + option.text+"</p>";
				}
				HTMLContent += "</form></td>";
				new_row.innerHTML = HTMLContent;
				break;
			}
			case 2:{
				var new_row = q_table.insertRow(-1);
				HTMLContent = "";
				HTMLContent += "<td id=\"Q_"+i.toString()+"\"><p>" +(i+1).toString()+". "+ q.title + "</p>";
				HTMLContent += "<form>";
				var options = q.options;
				for(var j = 0; j < q.n_option; j++){
					var option = options[j];
					HTMLContent += "<p><input type=\"checkbox\" name=\"single\" "
									+ "id=\"Q_"+i.toString()+"_"+j.toString() +"\" "
									+ "value=\""+ j.toString()+ "\">"
									+ String.fromCharCode(j + 65)
									+ ". " + option.text+"</p>";
				}
				HTMLContent += "</form></td>";
				new_row.innerHTML = HTMLContent;
				break;
			}
			case 3:{
				var new_row = q_table.insertRow(-1);
				HTMLContent = "";
				HTMLContent += "<td id=\"Q_"+i.toString()+"\"><p>" +(i+1).toString()+". "+ q.title + "</p>";
				HTMLContent += "<form>";
				HTMLContent += "<p ><input type=\"text\"" 
								+"id=\"Q_"+i.toString()+"_0\"></p>";
				HTMLContent += "</form></td>";
				new_row.innerHTML = HTMLContent;
				break;
			}
		}
	}

}); 

function submit(){
	for(var i = 0; i < questions.length; i++){
		var q = questions[i];
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
	alert(Astring);
}

