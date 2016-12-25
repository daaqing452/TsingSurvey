var color = Chart.helpers.color;

$(document).ready(function(){
	//第一题
	var barChartData1 = {
    labels: ["计21班", "计23班", "计24班", "计25班"],
    datasets: [{
  		label: "人数",
        backgroundColor:[
        '#ff6384',
        '#ff6384',
        '#ff6384',
        '#ff6384'
        ], 
        borderColor: window.chartColors.white,
        borderWidth: 2,
        data: [1,2,3,4]
    }]
	};
	var ctx = document.getElementById("canvas1").getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData1,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '1、你所在的班级是'
            }
        }
    });

    //第二题
    var barChartData2 = {
    labels: ["周杰伦", "谢晓晖", "鲁逸沁", "江雨晨"],
    datasets: [{
  		label: "人数",
        backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
        borderColor: window.chartColors.green,
        borderWidth: 2,
        data: [4,10,3,5]
    }]

	};
    var ctx = document.getElementById("canvas2").getContext("2d");
    window.myRadar = new Chart(ctx, {
        type: 'radar',
        data: barChartData2,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '2、你最喜欢的电影明星'
            },
            scale: {
              ticks: {
                beginAtZero: true
              }
            }
        }
    });

    //第三题
    var barChartData3 = {
    labels: ["周杰伦", "谢晓晖", "鲁逸沁", "江雨晨"],
    datasets: [{
  		label: "人数",
        backgroundColor: [
        	"#FF6384",
            "#36A2EB",
            "#FFCE56"
        	
        ],
        borderColor: window.chartColors.green,
        borderWidth: 2,
        data: [4,10,3,5]
    }]

	};
    var ctx = document.getElementById("canvas3").getContext("2d");
    window.myDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: barChartData3,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '2、你最喜欢的电影明星'
            },
            
        }
    });
	
});