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
            itemStyle : { normal: {label : {show: true}}},
            
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawRadar(myid,zuobiao,all_ave,your_ave){
    var myChart = echarts.init(document.getElementById(myid));
    var myIndicatior = [];
    for(var i = 0; i < zuobiao.length; i++){
        myIndicatior.push({ name: zuobiao[i], max: 4});
    }
    // 指定图表的配置项和数据
    var option = {
        tooltip: {},
        legend: {
            x : 'center',
            y : 'bottom',
            data: ['平均水平 ', '你 '],
        },
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#999',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
               }
            },
            indicator: myIndicatior,
            
        },
        series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
                {
                    value : all_ave,
                    name : '平均水平 '
                },
                 {
                    value : your_ave,
                    name : '你 '
                }
            ],
            itemStyle : { normal: {label : {show: true}}},
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
        	axisLabel : {
                        interval : 0,
                        formatter : function(params){
                            var newParamsName = "";
                            var paramsNameNumber = params.length;
                            var provideNumber = 4;
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                            if (paramsNameNumber > provideNumber) {
                                for (var p = 0; p < rowNumber; p++) {
                                    var tempStr = "";
                                    var start = p * provideNumber;
                                    var end = start + provideNumber;
                                    if (p == rowNumber - 1) {
                                        tempStr = params.substring(start, paramsNameNumber);
                                    } else {
                                        tempStr = params.substring(start, end) + "\n";
                                    }
                                    newParamsName += tempStr;
                                }

                            } else {
                                newParamsName = params;
                            }
                            return newParamsName
                        }
                    }

        },
        yAxis: {
        	data: mylabels
        },
        series: [{
            name: '人数',
            type: 'bar',
            data: mydata,
            itemStyle : { normal: {label : {show: true}}},
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
        col_dic.itemStyle = {normal: {label : {show: true}}};
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
        col_dic.itemStyle = {normal: {label : {show: true}}};
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
        	
    	},
        legend: {
        	
            data:mylabels,
        },

        series: [{
            name: '人数',
            type: 'pie',
            data: form_data,
            itemStyle:{ 
            normal:{ 
                  label:{ 
                    position : 'inner',
                    show: true, 
                    formatter : function (params){return (params.percent - 0) + '%';},
                  }, 
                  labelLine :{show:false} 
                } 
            },
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}