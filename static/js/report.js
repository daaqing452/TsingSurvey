
$(document).ready(function(){
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {'op': 'load'},
        success: function(data) {
            data = JSON.parse(data);
            report = JSON.parse(data['report']);
            $('p#title').text(data['title']);
            var div = $('div#report');
            for (i in report) {
                var item = report[i];
                // 单选，饼状图
                if (item['s_type'] == 1) {
                    var canvas = $('[type="clone"]').clone();
                    var canvas_id = 'canvas' + i;
                    canvas.attr('id', canvas_id);
                    div.append(canvas);
                    drawDoughnut(canvas_id, item['title'], item['options'], '', item['result']);
                } else
                // 多选，柱状图
                if (item['s_type'] == 2) {
                    var canvas = $('[type="clone"]').clone();
                    var canvas_id = 'canvas' + i;
                    canvas.attr('id', canvas_id);
                    div.append(canvas);
                    drawBar(canvas_id, item['title'], item['options'], '', item['result']);
                } else
                // 填空
                if (item['s_type'] == 3) {
                    var result = item['result'];
                    for (j in result) {
                        div.append('<p>' + result[j] + '</p><br/>');
                    }
                }
            }
        }
    });

    /*var ID = "canvas1"
    var labels = ["计21班", "计23班", "计24班", "计25班"];
    var label = "人数";
    var data = [1,2,3,4];
    var title = "1、你所在的班级是";
	drawBar(ID,title,labels,label,data);

    var ID = "canvas2"
    var labels = ["周杰伦", "谢晓晖", "鲁逸沁", "江雨晨"];
    var label = "人数";
    var data = [4,10,3,5];
    var title = "2、你最喜欢的电影明星";
    drawDoughnut(ID,title,labels,label,data);*/
});