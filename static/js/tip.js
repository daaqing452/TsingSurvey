var editor;
var tip;
$(document).ready(function(){
	editor = KindEditor.create('textarea[id="tip_text"]', {
        resizeType : 1,
        allowPreviewEmoticons : false,
        allowImageRemote : false,
        useContextmenu : false,
        uploadJson : '/uploadFile/',
        width : '100%',
        height : '400px',
        items : [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'emoticons', 'image','insertfile']
    });
});


function del_line(b){
	$b = $(b);
	$b.parents("div").eq(0).remove();
}

function get_content(){
	var tip = {title:$("#title").val()};
	tip.html = editor.html();
	var length = $("#attachment_list").children("div").length;
	tip.attachments = []
	for(var i = 0; i < length; i++){
		tip.attachments.push($("#attachment_list").children("div").eq(i).children("a").eq(0).attr("href"));
	}
	return tip;
}

function save(){
	tip = get_content();
	tip_string = JSON.stringify(tip);
	$.ajax({
		//save to database
	});
	return;
}

function submit(){
	tip = get_content();
	tip_string = JSON.stringify(tip);
	$.ajax({
		//save to database and situation changes
	});
	return;
}