// Developed by James Jansson
// Requires:
// flot plotting library to work
// Papaparse for the download button to work



function GeneralPlot(Settings){
	// The settings has the following format:
	// .InterfaceID = the ID of the container to put the graph into. Should be a unique ID on the page. Required
	// .xAxisLabel
	// .yAxisLabel
	// .Data = the data object associated with the graph. Required if you want to use the download button to call .Data.Download()
	// .ObjectID = the name of this GeneralPlot in global scope. Required
	// DownloadSummaryStatisticCSV(SimulationHolder.Result[0].AgeInfectedResult);
	
	// "Value "
	
	// Check that there are any ID names that are taken
	//console.error("Using '"+Settings.InterfaceID+"' as an ID for the plot creates a parameter '" + PrexistingID + "' that already exists.";
	
	// Store information associated with this plot
	
	console.log(Settings)
	
	// InterfaceID
	if (typeof(Settings.InterfaceID)!='undefined'){
		this.InterfaceID=Settings.InterfaceID;
	}
	else {
		throw "In order to use the GeneralPlot function, you must set the Settings.InterfaceID value to the name of the div element you wish to place the plot into.";
	}
	this.PlotPlaceholder="#"+Settings.InterfaceID+"_placeholder";
	
	// Object ID
	if (typeof(Settings.ObjectID)!='undefined'){
		this.ObjectID=Settings.ObjectID;
	}
	else {
		throw "In order to use the GeneralPlot function, you must set the Settings.ObjectID value to the string of the name of the variable that represents this object, such that HTML can be constructed around this object.";
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
	// .X (or .Category) .Y .Upper .Lower .ObjectID
	
	// PlotData contains
	// .XMin .XMax .YMin .YMax
	// These can be edited by the options interface
	
	// The .Data element can be used for selecting new graphing options in the graphing panel, and to allow data to be downloaded
	var DownloadButtonHTML="";//by default blank if the download data function does not exist
	if (typeof(Settings.Data)!='undefined'){
		this.Data=Settings.Data;
		
		// If the .Data hads a function called "Download", create a button that allows the download of Data
		if (typeof(this.Data.Download)=='function'){
			DownloadButtonHTML="        <div class='downloadbutton' title='Download data' onclick='"+this.ObjectID+".Download();'>&#x21E9;</div>\n";
		}
	}

	
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
		// Drop down: X value, .ObjectID .Values
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
	
	// Display plot title
	this.Title="";
	if (typeof(Settings.Title)!='undefined'){
		this.Title=Settings.Title;
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
	this.InnerHTMLForPlot+="    <div class='fullscreenbox' id='"+this.InterfaceID+"_fullscreenbox' >\n";
	this.InnerHTMLForPlot+="        <div class='plot_title' >"+this.Title+"</div>\n";
	this.InnerHTMLForPlot+="        <div class='saveimagebutton' title='Save image' onclick='"+this.ObjectID+".SaveImage();'>&#x2357</div>\n";
	this.InnerHTMLForPlot+=DownloadButtonHTML;
	this.InnerHTMLForPlot+="        <div class='fullscreenbutton' title='Fullscreen' id='"+this.ObjectID+"_fullscreenbutton' onclick=\"ToggleFullScreen('"+this.InterfaceID+"_fullscreenbox');\">&#10063</div>\n";
	this.InnerHTMLForPlot+="        <div class='plot_positioner'>\n";
	this.InnerHTMLForPlot+="             <div id='"+this.InterfaceID+"_placeholder' class='plot_placeholder'></div>\n";
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
	document.getElementById(this.InterfaceID).innerHTML=this.InnerHTMLForPlot;
	this.Update();
};

GeneralPlot.prototype.Update= function (){//using prototyping for speed
	return this.PlotFunction(this.PlotPlaceholder, this.PlotData);
};

GeneralPlot.prototype.Download= function (){//using prototyping for speed
	return this.Data.Download();
};

GeneralPlot.prototype.SaveImage= function (){//using prototyping for speed
	// var InterfaceObject=document.getElementById(this.InterfaceID+"_fullscreenbox");
	var InterfaceObject=document.getElementById(this.InterfaceID);



	// this is based off the following gist: https://gist.github.com/rdtsc/5074753e163397f3d247
	// usage
	//NWJSHTMLToPNG=require(NWJSHTMLToPNG);
	
	
	
	function CaptureAndSave(InterfaceObject, NameWithoutExtension) {
		var gui = require('nw.gui');
		var win = gui.Window.get();
		var fs  = require('fs');
		
		function CaptureRegion(rect, callback, format) {
			
			win.capturePage(function(data) {
				var img = new Image();
			
				img.onload = function() {
				var canvas = document.createElement('canvas');
			
				canvas.width  = rect.width;
				canvas.height = rect.height;
			
				
			
				canvas.getContext('2d').drawImage(img, -rect.left, -rect.top);
				callback(canvas.toDataURL('image/' + format));
				};
			
				img.src = data;
			}, 'png'); // Ensure JPEG compression happens only once, if ever.
		}
		function dumpBase64(data, filename, callback) {
			data = data.substr(data.indexOf(',') + 1);
			
			fs.writeFile(filename, data, 'base64', callback);
		}
		
		var bounds = InterfaceObject.getBoundingClientRect();
		
		var filename = NameWithoutExtension+'.png';
		var imageFmt = 'png';
		
		CaptureRegion(bounds, function(data) {
			dumpBase64(data, filename, function(error) {
				if(error) throw error;
			});
		}, imageFmt);
	}

	//var target = document.getElementById('HCVOptSelectorHolder_DEOResultsPlot_0');
	var FileNameWOExt=this.Title;
	if (FileNameWOExt.length==0){
		FileNameWOExt=untitled
	}
	
	
	CaptureAndSave(InterfaceObject, FileNameWOExt);








	// console.log(InterfaceObject);

	// //InterfaceObject=document.body;

	// html2canvas(InterfaceObject, {
	// 	onrendered: function(canvas) {
	// 		var fs = require('fs');
			
	// 		console.log(canvas.length);
			
	// 		//document.body.appendChild(canvas);
	// 		var imgdatalink = canvas.toDataURL("image/png");// get the URL of the canvas data
			
	// 		var data = imgdatalink.replace(/^data:image\/\w+;base64,/, "");
	// 		var buf = new Buffer(data, 'base64');
	// 		fs.writeFile('image.png', buf);
			
	// 		InterfaceObject.appendChild(canvas);
			
			
	// 		var imgdata=imgdatalink.split(',')[1];// split off the URL section and keep data
	// 		var DecodedImg = window.atob(imgdata);
			
	// 		var name='./woah.png';
	// 		var imgFileData = new Buffer(DecodedImg, encoding='base64');
			
	// 		console.log(imgdatalink);
	// 		console.log(imgdata);
			
	// 		fs.writeFile(name, imgFileData, function(err) {
	// 			if(err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log("The file was saved!");
	// 			}
	// 		});
			
	// 		// link = document.createElement('a');
	// 		// link.href = imgdatalink ;
	// 		// console.log(imgdatalink);
			
	// 		// link.download = 'Download.png';
	// 		// document.body.appendChild(link);
	// 		// link.click();
	// 	}
	// });
	

	return 0;
};


// Example code
// PlotSettings=[];
// PlotSettings.Name="PlotObjectName";// what the object will be called later in this line var PlotObjectName=new GeneralPlot(PlotSettings);
// PlotSettings.ID="testplot";
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

// PlotSettings.Data=[];
// PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

// var PlotObjectName=new GeneralPlot(PlotSettings);
// PlotObjectName.Draw();

//Yet to be implemented steps
// PlotSettings.Download=function (){OriginalDataDraw.Download()};
// PlotSettings.Title


function PlotStyles_ConvertDataToLinePlot(x, InputMatrix){//Accepts [param][time] or [y][x]. Future systems will accept [param][time][sim]
	var LinePlotData=[];
	var NumberOfLines=InputMatrix.length;
	for (var i=0; i<NumberOfLines; i++){
		if (x.length!=InputMatrix[i].length){
			console.error("Input data is incorrect lengths. x.length; " + x.length + " InputMatrix[i].length: " +InputMatrix[i].length);
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
	var PlotData=PlotStyles_ConvertDataToLinePlot(X, ArrayToPlot);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	var PlotSettings={xaxis: {
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

function ScatterPlot(PlotHolderName, Data,  xAxisLabel, yAxisLabel){
	//Example usage
		//Data.X=[0, 1, 2, 3, 4, 5];
		//Data.Y=[10, 7, 6, 3, 2, 1.5];
		//ScatterPlot('#PlotHolder', Data,  'Step', 'Error Value');
	if (Data.X.length!=Data.Y.length){
		throw "Data vectors should be the same length.";
	}
	
	var Points=[];
	for (var key in Data.X){
		Points[key]=[Data.X[key], Data.Y[key]];
	}
		
	var PlotSettings={xaxis: {
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
	var PlotData=[];
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
		var PlotSettings={xaxis: {
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
	var PlotData=[];
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
			{color: "rgba(0, 0, 0, 0.7)",  points: OriginalPlot.PointStyle, data: OriginalPlot.Data, label: "Data"}, 
			{color: "rgba(255, 0, 0, 0.7)",  lines: {show: true}, points: OptimisedPlot.PointStyle, data: OptimisedPlot.Data, label: "Model"},
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







