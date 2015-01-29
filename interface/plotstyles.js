// Developed by James Jansson
// Requires:
// flot plotting library to work
// Papaparse for the download button to work
// Requires 
// also requires the morris.js library to work


function BuildPlot(Settings){
	// The settings has the following format:
	// .ID = the ID of the container to put the graph into. Should be a unique ID on the page. Required
	// .xAxisLabel
	// .yAxisLabel
	// .Data
	// 
	// DownloadSummaryStatisticCSV(SimulationHolder.Result[0].AgeInfectedResult);
	
	// "Value "
	
	// Check that there are any ID names that are taken
	//console.error("Using '"+Settings.ID+"' as an ID for the plot creates a parameter '" + PrexistingID + "' that already exists.";
	
	// Build HTML
	InnerHTMLForPlot="";
	InnerHTMLForPlot+="    <div class='fullscreenbox' id='"+Settings.ID+"_fullscreenbox' >";
	InnerHTMLForPlot+="        <div class='fullscreenbutton' title='Fullscreen' id='"+Settings.ID+"_fullscreenbutton' onclick='ToggleFullScreen('"+Settings.ID+"_fullscreenbox');'>&#10063</div>";
	InnerHTMLForPlot+="        <div class='downloadbutton' title='Download data' onclick='"+Settings.ID+"_data.Download();'>&#x21E9;</div>";
	InnerHTMLForPlot+="        <div class='plot_positioner'>";
	InnerHTMLForPlot+="             <div id='"+Settings.ID+"_placeholder' class='plot_placeholder'></div>";
	InnerHTMLForPlot+="        </div>";
	InnerHTMLForPlot+="        <div class='xlabel'>Year</div>";
	InnerHTMLForPlot+="        <div class='ylabel'><div class='rotate'>Y Axis Label</div></div>";
	InnerHTMLForPlot+="    </div>";
	
	document.getElementById(Settings.ID).innerHTML=InnerHTMLForPlot;
	
	// Create plot


}

function PlotStyles_ConvertDataToLinePlot(x, InputMatrix){//Accepts [param][time] or [y][x]. Future systems will accept [param][time][sim]
	var LinePlotData=[];
	var NumberOfLines=InputMatrix.length;
	for (var i=0; i<NumberOfLines; i++){
		if (x.length!=InputMatrix[i].length){
			console.error("Input data is incorrect lengths.");
		}
		var ThisLine=[];
		for (var j = 0; j < InputMatrix[i].length; j++) {
			ThisLine.push([x[j], InputMatrix[i][j]]);
		}
		LinePlotData.push(ThisLine);
	}
	return LinePlotData;
}

function PlotStyles_Transpose(InputMatrix){
	var ReturnMatrix=[];
	var Nxdim=InputMatrix[1].length;
	var Nydim=InputMatrix.length;
	for (var j=0; j<Nydim; j++){
		if (InputMatrix[1].length!=InputMatrix[j].length){
			throw "Input data is incorrect lengths.";
		}
	}
	for (var i = 0; i < Nxdim; i++) {
		ReturnMatrix[i]=[];
		var ThisLine=[];
		for (var j=0; j<Nydim; j++){
			ReturnMatrix[i][j]=InputMatrix[j][i];
		}
	}
	return ReturnMatrix;
}


function StackedLinePlot(PlotHolderName, X, ArrayToPlot,  xAxisLabel, yAxisLabel){
	// convert to a form that plot will accept
	PlotData=PlotStyles_ConvertDataToLinePlot(X, ArrayToPlot);
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
	PlotData=PlotStyles_ConvertDataToLinePlot(X, ArrayToPlot);
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


function OptimisationPlot(PlotHolderName, FittingData, OptimisedResults,  xAxisLabel, yAxisLabel){
	// FittingData.X
	// FittingData.Value an array of y values associated with mean/median estimate
	// FittingData.Upper a vector of values that indicate the upper value of the fitting data (optional)
	// FittingData.Lower a vector of values that indicate the lower value of the fitting data (optional)
	
	// OptimisedResults.X
	// OptimisedResults.Value an array of y values associated with mean/median estimate
	// OptimisedResults.Upper a vector of values that indicate the upper value of the optimised results (optional)
	// OptimisedResults.Lower a vector of values that indicate the lower value of the optimised results (optional)
	
	
	// Determine if error bars are present in either of the data
	//if (typeof(FittingData.Upper)!='undefined' && typeof(FittingData.Lower)!='undefined'){
	//	var temp=PlotStyles_ConvertDataToLinePlot(FittingData.X, [FittingData.Value, FittingData.Lower, FittingData.Upper]);
		// This is still not in the correct format (value need to be the difference between "value" and "lower"
		
		
	//	var 
	//}
	//else{
	
	
	//}
	
	// Reformat the data into the appropriate form
	
	
	var data1 = [
			[.7,3.2,.2,.4],    // x, y, lower y by, higher y by
			[1.7,2.2,.3,.4],
			[2.5,1,.5,.2]
		];
	
	var data2 = [
			[.7,3,.2,.4],    // x, y, lower y by, higher y by
			[1.5,2.2,.3,.4],
			[2.3,1,.5,.2]
		];
		
		
	
	
	var points_with_error_formatting = {
		show: true,
		radius: 5,
		errorbars: "y", 
		yerr: {show:true, asymmetric:true, upperCap: "-", lowerCap: "-"}
	};
	
	var simple_points_formatting = {
		show: true,
		radius: 5
	};
	
	
	
	// Combine all the data to be included in the graph
	var data = [
			{color: "rgba(0, 0, 0, 0.7)",  points: points_with_error_formatting, data: data1, label: "Original Data"}, 
			{color: "rgba(255, 0, 0, 0.7)",  lines: {show: true}, points: points_with_error_formatting, data: data2, label: "Optimised Result"},
		];
	
	
	$.plot($(PlotHolderName), data , {
		legend: {
			position: "sw",
			show: true
		},
		series: {
			lines: {
				show: false
			}
		},
		zoom: {
			interactive: true
		},
		pan: {
			interactive: true
		}
	});
	
	
}








// All of the content below this line will be deleted

MorrisSettings={
  // ID of the element in which to draw the chart.
  element: 'plot1_plotarea',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  data: [
    { year: '2008', value: 20 },
    { year: '2009', value: 10 },
    { year: '2010', value: 5 },
    { year: '2011', value: 5 },
    { year: '2012', value: 20 }
  ],
  // The name of the data record attribute that contains x-values.
  xkey: 'year',
  // A list of names of data record attributes that contain y-values.
  ykeys: ['value'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Value']
}


function MorrisScatterPlot(Settings){
	// Example usage
	

	// Put the data into a format that the download function can understand
	
	// change default behaviour
	if (typeof Settings.parseTime==="undefined"){
		Settings.parseTime=false;// this allows the x axis to be an arbitrary number, not just a date
	}
	
	// take the current element, replace the contents with x axis label, y axis label, download button and plotting region
	var SettingsCopy=SetUpPlotArea(Settings);
	
	// make the settings work for scatter
	SettingsCopy.lineWidth=0;
	
	
	// parse the Settings into the morris.js
	return Morris.Line(SettingsCopy);// return the object representing the plot to be editted later, e.g.
	// Using graph=ScatterPlot(settings); graph.setData(SomeObjectContainingData);
}

function SetUpPlotArea(Settings){
	// The purpose of this section is to make 



	// take the current element, replace the contents with x axis label, y axis label, download button and plotting region
	var PlottingAreaID=Settings.element;

	var ContentString="";
	
	
	
	
	// use papaparse to convert from JSON to csv
	if (typeof Morris==="undefined"){
		console.error("This library requires morris.js to run");
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
