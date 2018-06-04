var color = Chart.helpers.color;

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
};

window.randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}

function drawBar(myID,mytitle,mylabels,mylabel,mydata){
    var barChartData = {
    labels: mylabels,
    datasets: [{
        label: "统计结果",
        backgroundColor:[
            window.chartColors.red,
            window.chartColors.yellow,
            window.chartColors.green,
            window.chartColors.blue,
            window.chartColors.purple,
            window.chartColors.orange,
            window.chartColors.grey,
        ], 
        borderColor: window.chartColors.white,
        borderWidth: 2,
        data: mydata
    }
        
    ]   
    };
    var ctx = document.getElementById(myID).getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            title: {
                display: false,
                text: mytitle,
                fontSize : 19,
            },
            scales: {
                xAxes: [{
                    barThickness:35,
                }],
                yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    stepSize:1,
                    barThickness:20,

                }
                }]
            },
            
        }
    });

}

function drawDoughnut(myID,mytitle,mylabels,mylabel,mydata){
    var barChartData = {
    labels: mylabels,
    datasets: [{
        label: mylabel,
        backgroundColor:[
            window.chartColors.red,
            window.chartColors.yellow,
            window.chartColors.green,
            window.chartColors.blue,
            window.chartColors.purple,
            window.chartColors.orange,
            window.chartColors.grey,
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
                text: mytitle,
                fontSize : 19,
            },
        }
    });
}