function drawBar(myid,mylabels,mydata){
	var myChart = echarts.init(document.getElementById(myid));
    // 指定图表的配置项和数据
    var option = {
        title: {
            
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
        	data: mylabels
        },
        yAxis: {
        
        },
        series: [{
            name: '人数',
            type: 'bar',
            data: mydata,
            
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawHBar(myid,mylabels,mydata){
	var myChart = echarts.init(document.getElementById(myid));
    // 指定图表的配置项和数据
    var option = {
        title: {
            
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
        	
        },
        yAxis: {
        	data: mylabels
        },
        series: [{
            name: '人数',
            type: 'bar',
            data: mydata,
         
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawMBar(myid,myrowlabels,mycollabels,mydata){
	var myChart = echarts.init(document.getElementById(myid));
	var myseries = new Array();
	for(var i = 0; i < mycollabels.length; i++){
		var col_dic = {};
		col_dic.name = mycollabels[i];
		col_dic.type = "bar";
		col_dic.stack = "barstack";
		col_dic.data = mydata[i];
		myseries.push(col_dic);
	}
    // 指定图表的配置项和数据
    var option = {
        title: {
            
        },
        tooltip: {},
        legend: {
            data:mycollabels
        },
        xAxis: {
        	data:myrowlabels
        },
        yAxis: {
        	
        },
        series: myseries
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawSBar(myid,myrowlabels,mycollabels,mydata){
	var myChart = echarts.init(document.getElementById(myid));
	var myseries = new Array();
	for(var i = 0; i < mycollabels.length; i++){
		var col_dic = {};
		col_dic.name = mycollabels[i];
		col_dic.type = "bar";
		//col_dic.stack = "barstack";
		col_dic.data = mydata[i];
		myseries.push(col_dic);
	}
    // 指定图表的配置项和数据
    var option = {
        title: {
            
        },
        tooltip: {},
        legend: {
            data:mycollabels
        },
        xAxis: {
        	data:myrowlabels
        },
        yAxis: {
        	
        },
        series: myseries
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawDoughnut(myid,mylabels,mydata){
	var form_data = new Array();
	for(var i = 0; i < mylabels.length; i++){
		form_data.push({value:mydata[i],name:mylabels[i]})
	}
	var myChart = echarts.init(document.getElementById(myid));
    // 指定图表的配置项和数据
    var option = {
        title: {
            
        },
        tooltip: {
        	trigger: 'item',
        	formatter: "{a} <br/>{b}: {c} ({d}%)"
    	},
        legend: {
        	
            data:mylabels,
        },

        series: [{
            name: '人数',
            type: 'pie',
            data: form_data,
            labelLine: {
                normal: {
                    show: false
                }
            },
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}