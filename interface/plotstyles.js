// Developed by James Jansson
// Requires the flot plotting library to work
// also requires the morris.js library to work


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




function MorrisScatterPlot(Settings){
	// take the current element, replace the contents with x axis label, y axis label, download button and plotting region
	var SettingsCopy=SetUpPlotArea(Settings);
	
	// make the settings work for scatter
	SettingsCopy.lineWidth=0;
	
	
	// parse the Settings into the morris.js
	return Morris.Line(SettingsCopy);// return the object representing the plot to be editted later, e.g.
	// Using graph=ScatterPlot(settings); graph.setData(SomeObjectContainingData);
}

function SetUpPlotArea(Settings){
	// take the current element, replace the contents with x axis label, y axis label, download button and plotting region
	var PlottingAreaID=Settings.element;

	var ContentString="";
	
	// change default behaviour
	if (typeof Settings.parseTime==="undefined"){
		Settings.parseTime=false;// this allows the x axis to be an arbitrary number, not just a date
	}
	
	
	// use papaparse to convert from JSON to csv
	if (typeof Morris==="undefined"){
		onsole.error("This library requires morris.js to run");
	}
	

	
	
	if(typeof Papa==="undefined"){
		console.log("If PapaParse.js is not included, a download button for the data cannot be included");
	}	
	else{
		//var csvdata = Papa.unparse([
		//{
		//	"Column 1": "foo",
		//	"Column 2": "bar"
		//},
		//{
		//	"Column 1": "abc",
		//	"Column 2": "def"
		//}
		//]);
		var csvdata = Papa.unparse(Settings.data);
		var DownloadDataString="var blob = new Blob([this.csvdata], {type: 'text/plain;charset=utf-8'});saveAs(blob, 'plotdata.csv');";
		
		//create and position the download object
		ContentString=ContentString+"<downloadbutton href='"+DownloadDataString+"'>\21E9</downloadbutton>";
		
		//var blob = new Blob([this.csvdata], {type: "text/plain;charset=utf-8"});
		//saveAs(blob, "plotdata.csv");
	}
	
	// x axis
	ContentString=ContentString+"<xAxisLabel>"+Settings.xAxisLabel+"</xAxisLabel>";
	// y axis
	ContentString=ContentString+"<yAxisLabel>"+Settings.yAxisLabel+"</yAxisLabel>";
	// plotting area
	
	
	// Put it into the HTML
	document.getElementById(PlottingAreaID).innerHTML=ContentString;
	
	var SettingsCopy=JSON.parse(JSON.stringify(Settings));
	SettingsCopy.element=SettingsCopy.element+"sub";// add this to the name of the element such that the correct area is addressed
	return SettingsCopy;
}

//convert data
