function StackedPlot(PlotHolderName, X, ArrayToPlot,  xAxisLabel, yAxisLabel){

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
	
	//plot of HCVTestPlotHolder
	$.plot(PlotHolderName, PlotData, PlotSettings);

}


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