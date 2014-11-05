// Developed by James Jansson
// Requires the flot plotting library to work


function ConvertDataToLinePlot(x, InputMatrix){//Accepts [param][time] or [y][x]. Future systems will accept [param][time][sim]
	LinePlotData=[];
	NumberOfLines=InputMatrix.length;
	for (i=0; i<NumberOfLines; i++){
		ThisLine=[];
		for (var j = 0; j < InputMatrix[i].length; j++) {
			ThisLine.push([x[j], InputMatrix[i][j]]);
		}
		LinePlotData.push(ThisLine);
	}
	return LinePlotData;
}


function StackedLinePlot(PlotHolderName, X, ArrayToPlot,  xAxisLabel, yAxisLabel){
	// convert to a form that plot will accept
	PlotData=ConvertDataToLinePlot(X, ArrayToPlot);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	PlotSettings={xaxis: {
					axisLabel: xAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					axisLabel: yAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				},
				series: {
					lines: {
						show: true,
						fill: true
					},
					stack: true
				}
			};
	$.plot(PlotHolderName, PlotData, PlotSettings);
}

function StackedBarPlot(PlotHolderName, X, ArrayToPlot,  xAxisLabel, yAxisLabel){
	// convert to a form that plot will accept
	PlotData=ConvertDataToLinePlot(X, ArrayToPlot);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	PlotSettings={xaxis: {
					axisLabel: xAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					axisLabel: yAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				},
				series: {
					bars: {
						align: "center",
						show: true,
						barWidth: 0.6,
						fill: true
					},
					stack: true
				}
			};
	$.plot(PlotHolderName, PlotData, PlotSettings);
}

function ScatterPlot(PlotHolderName, Points,  xAxisLabel, yAxisLabel){
	//Example usage
		//var data = [[0, 3], [4, 8], [8, 5], [9, 13]];
		//ScatterPlot("#PlotHolder", data,  "AAA", "BBB");
		PlotSettings={xaxis: {
					axisLabel: xAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					axisLabel: yAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				}
			};
	PlotData=[];
	PlotData[0]={};
	PlotData[0].data=Points;
	PlotData[0].points={show:true, radius: 1, filled:true};
	PlotData[0].color="rgb(255, 0, 0)";
	$.plot(PlotHolderName, PlotData, PlotSettings);
}

function FixedAxisScatterPlot(PlotHolderName, Points,  xAxisLabel, yAxisLabel, xmin, xmax, ymin, ymax){
	//Example usage
		//var data = [[0, 3], [4, 8], [8, 5], [9, 13]];
		//ScatterPlot("#PlotHolder", data,  "AAA", "BBB");
		PlotSettings={xaxis: {
					min: xmin,
					max: xmax,
					axisLabel: xAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					min: ymin,
					max: ymax,
					axisLabel: yAxisLabel,
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				}
			};
	PlotData=[];
	PlotData[0]={};
	PlotData[0].data=Points;
	PlotData[0].points={show:true, radius: 1, filled:true};
	PlotData[0].color="rgb(255, 0, 0)";
	$.plot(PlotHolderName, PlotData, PlotSettings);
}

