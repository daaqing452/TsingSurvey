var color = Chart.helpers.color;
function drawBar(myID,mytitle,mylabels,mylabel,mydata){
    var barChartData = {
    labels: mylabels,
    datasets: [{
        label: mylabel,
        backgroundColor:[
        '#ff6384',
        '#ff6384',
        '#ff6384',
        '#ff6384'
        ], 
        borderColor: window.chartColors.white,
        borderWidth: 2,
        data: mydata
    }]
    };
    var ctx = document.getElementById(myID).getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: mytitle
            }
        }
    });

}

function drawDoughnut(myID,mytitle,mylabels,mylabel,mydata){
    var barChartData = {
    labels: mylabels,
    datasets: [{
        label: mylabel,
        backgroundColor:[
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
        ], 
        borderColor: window.chartColors.white,
        borderWidth: 2,
        data: mydata
    }]
    };
    var ctx = document.getElementById(myID).getContext("2d");
    window.myDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: mytitle
            }
        }
    });

}
$(document).ready(function(){
	//第一题
    var ID = "canvas1"
    var labels = ["计21班", "计23班", "计24班", "计25班"];
    var label = "人数";
    var data = [1,2,3,4];
    var title = "1、你所在的班级是";
	drawBar(ID,title,labels,label,data);

    

    //第二题
    var ID = "canvas2"
    var labels = ["周杰伦", "谢晓晖", "鲁逸沁", "江雨晨"];
    var label = "人数";
    var data = [4,10,3,5];
    var title = "2、你最喜欢的电影明星";
    drawDoughnut(ID,title,labels,label,data);
    
	
});