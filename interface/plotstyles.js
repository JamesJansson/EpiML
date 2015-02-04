// Developed by James Jansson
// Requires:
// flot plotting library to work
// Papaparse for the download button to work
// Requires 
// also requires the morris.js library to work


function GeneralPlot(Settings){
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
	
	// Store information associated with this plot
	
	
	// ID
	if (typeof(Settings.ID)!='undefined'){
		this.ID=Settings.ID;
	}
	else {
		throw "In order to use the GeneralPlot function, you must set the Settings.ID value to the name of the div element you wish to place the plot into.";
	}
	this.PlotPlaceholder="#"+Settings.ID+"_placeholder";
	
	
	if (typeof(Settings.Name)!='undefined'){
		this.Name=Settings.Name;
	}
	else {
		throw "In order to use the GeneralPlot function, you must set the Settings.Name value to the string of the name of the variable that represents this object, such that HTML can be constructed around this object.";
	}
			
	this.PlotFunction=Settings.PlotFunction;// should have the format function(PlotPlaceholder, PlotData){}
	// e.g. 
	// Settings.PlotFunction=function(PlotPlaceholder, PlotData){
	// 	   var OriginalData=PlotData.Plot[1]; // note in this case, since the OriginalData and OptimisedResults have the same format as PlotData.Plot (.X .Y .Upper .Lower) we can simply use this format
	// 	   var OptimisedResults=PlotData.Plot[2];
	//     return OptimisationPlot(PlotPlaceholder, OriginalData, OptimisedResults);
	// }
	this.PlotData=Settings.PlotData;// A structure that can contain anything that is needed to graph
	// note: PlotData contains an array of Plot[] that each contain:
	// .X (or .Category) .Y .Upper .Lower .Name
	
	// PlotData contains
	// .XMin .XMax .YMin .YMax
	// These can be edited by the options interface
	
	this.DownloadFunction=Settings.DownloadFunction;
	this.DownloadData=Settings.DownloadData;

	
	// Options window
	// The Options window initially only displays min/max 
	var OptionsPanelHTML="";
	this.DisplayOptionsPanel=false; // the default is to not display it unless the option is selected
	if (typeof(Settings.DisplayOptionsPanel)!='undefined'){
		this.DisplayOptionsPanel=Settings.DisplayOptionsPanel;// This is the first point at which displaying the options panel becomes possible
	}
	
	// This is where the set up of the Options parameter selection occurs
	if (typeof(Settings.Options)!='undefined'){
		this.DisplayOptionsPanel=true;
		this.Options=Settings.Options;
		
		// this.Options will contain the following elements
		// PossibleXValues
		// for each x value, the possible y values 
		// PossibleYValues
		// PossibleYValuesUncertainties
		
		
		// Drop down: PlotStyle
		//      PlotFunction (on selection 
		// Drop down: X value, .Name .Values
		// Drop down: Plot 1
		//     Drop down: Y value
		//     Drop down: Display uncertainty (none), 
		//     Lower un
		//     Can only plot this if the X value name exists in the parameter 
		
		
		
		
		// Need to work out if we are going to force coupling of values or not, I say yes
		
		// The close button causes the graph to update with the new settings.
		// Visibility initial set to false
		
		var PlotVariableSelectionHTML="";
		
	}
	
	
	// Set up axis labels
	this.XLabel="";
	if (typeof(Settings.XLabel)!='undefined'){
		this.XLabel=Settings.XLabel;
	}
	this.YLabel="";
	if (typeof(Settings.YLabel)!='undefined'){
		this.YLabel=Settings.YLabel;
	}
			
	// Build HTML
	this.InnerHTMLForPlot="";
	this.InnerHTMLForPlot+="    <div class='fullscreenbox' id='"+Settings.ID+"_fullscreenbox' >\n";
	this.InnerHTMLForPlot+="        <div class='fullscreenbutton' title='Fullscreen' id='"+Settings.ID+"_fullscreenbutton' onclick=\"ToggleFullScreen('"+Settings.ID+"_fullscreenbox');\">&#10063</div>\n";
	this.InnerHTMLForPlot+="        <div class='downloadbutton' title='Download data' onclick='"+Settings.ID+"_data.Download();'>&#x21E9;</div>\n";
	this.InnerHTMLForPlot+="        <div class='plot_positioner'>\n";
	this.InnerHTMLForPlot+="             <div id='"+this.ID+"_placeholder' class='plot_placeholder'></div>\n";
	this.InnerHTMLForPlot+="        </div>\n";
	this.InnerHTMLForPlot+="        <div class='xlabel'>"+this.XLabel+"</div>\n";
	this.InnerHTMLForPlot+="        <div class='ylabel'><div class='rotate'>"+this.YLabel+"</div></div>\n";
	this.InnerHTMLForPlot+="    </div>\n";
	
	// Create plot
	
	// .Update() //Only updates plot
	
	// .Download(){
		//this.DownloadFunction(this.DownloadData);
	//}
}


GeneralPlot.prototype.Draw= function (){//using prototyping for speed
	document.getElementById(this.ID).innerHTML=this.InnerHTMLForPlot;
	this.Update();
};

GeneralPlot.prototype.Update= function (){//using prototyping for speed
	return this.PlotFunction(this.PlotPlaceholder, this.PlotData);
};


// Example code
// PlotSettings=[];
// PlotSettings.Name="PlotObjectName";// what the object will be called later
// PlotSettings.ID="plot2";
// PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
	   // var OriginalData=PlotData.Plot[0]; // note in this case, since the OriginalData and OptimisedResults have the same format as PlotData.Plot (.X .Y .Upper .Lower) we can simply use this format
	   // var OptimisedResults=PlotData.Plot[1];
    // return OptimisationPlot(PlotPlaceholder, OriginalData, OptimisedResults);
// }
// PlotSettings.PlotData=[];
// PlotSettings.PlotData.Plot=[];

// var OriginalData=[];
// OriginalData.X=[2, 4, 6];
// OriginalData.Y=[1.3, 2.3, 2.9];
// var OptimisedResults=[];
// OptimisedResults.X=[2, 4, 6];
// OptimisedResults.Y=[1.5, 2.5, 3.5];
// OptimisedResults.Lower=[1.1, 2.1, 2.7];
// OptimisedResults.Upper=[1.9, 2.9, 3.9];

// PlotSettings.PlotData.Plot[0]=OriginalData;
// PlotSettings.PlotData.Plot[1]=OptimisedResults;

// PlotSettings.XLabel="Year";
// PlotSettings.YLabel="Number";

// var PlotObjectName=new GeneralPlot(PlotSettings);
// PlotObjectName.Draw();





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


function OptimisationPlot(PlotHolderName, OriginalData, OptimisedResults){
	// OriginalData.X
	// OriginalData.Y an array of y values associated with mean/median estimate
	// OriginalData.Upper a vector of values that indicate the upper value of the fitting data (optional)
	// OriginalData.Lower a vector of values that indicate the lower value of the fitting data (optional)
	
	// OptimisedResults.X
	// OptimisedResults.Y an array of y values associated with mean/median estimate
	// OptimisedResults.Upper a vector of values that indicate the upper value of the optimised results (optional)
	// OptimisedResults.Lower a vector of values that indicate the lower value of the optimised results (optional)
	
	// Example test code
	// PlotHolderName="#plot1_placeholder";
	// var OriginalData=[];
	// OriginalData.X=[2, 4, 6];
	// OriginalData.Y=[1.3, 2.3, 2.9];
	// var OptimisedResults=[];
	// OptimisedResults.X=[2, 4, 6];
	// OptimisedResults.Y=[1.5, 2.5, 3.5];
	// OptimisedResults.Lower=[1.1, 2.1, 2.7];
	// OptimisedResults.Upper=[1.9, 2.9, 3.9];
	
	function StylingFunction(InputData){
		var ThingToReturn=[];
		// Determine if error bars are present in either of the data
		if (typeof(InputData.Upper)!='undefined' && typeof(InputData.Lower)!='undefined'){
			// Reformat the data into the appropriate form
			var TempMat=PlotStyles_Transpose([InputData.X, InputData.Y, InputData.Lower, InputData.Upper]);
			// This is still not in the correct format (needs to be the difference between "value" and "lower", and "value" and "upper"
			for (var i=0; i<TempMat.length; i++){
				TempMat[i][2]=TempMat[i][1]-TempMat[i][2];
				TempMat[i][3]=TempMat[i][3]-TempMat[i][1];
			}
			ThingToReturn.Data=TempMat;
			
			ThingToReturn.PointStyle = {
				show: true,
				radius: 5,
				errorbars: "y", 
				yerr: {show:true, asymmetric:true, upperCap: "-", lowerCap: "-"}
			};
		}
		else{
			// Reformat the data into the appropriate form
			var TempMat=PlotStyles_Transpose([InputData.X, InputData.Y]);
			ThingToReturn.Data=TempMat;
			
			ThingToReturn.PointStyle = {
				show: true,
				radius: 5
			};
		}
		return ThingToReturn;
	}
	
	var OriginalPlot=StylingFunction(OriginalData);
	var OptimisedPlot=StylingFunction(OptimisedResults);
	
	// Combine all the data to be included in the graph
	var data = [
			{color: "rgba(0, 0, 0, 0.7)",  points: OriginalPlot.PointStyle, data: OriginalPlot.Data, label: "Original Data"}, 
			{color: "rgba(255, 0, 0, 0.7)",  lines: {show: true}, points: OptimisedPlot.PointStyle, data: OptimisedPlot.Data, label: "Optimised Result"},
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
