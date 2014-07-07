
var SimResult=[];

var WorkerMessageHandler = function (e) {
	//console.log(e.data.result);

	// There are 3 main 
	// Messages to the console
	// Messages to the StatusText
	// Messages to the ProgressBar
	// Message to return result/indicate completeness
	
	// Messages to the console
	if (typeof e.data.ConsoleMessage != 'undefined'){
		console.log(e.data.ConsoleMessage);
	}
	// Messages to the ProgressBar
	if (typeof e.data.ProgressBarValue != 'undefined'){
		MainProgress.value=e.data.ProgressBarValue;
	}
	if (typeof e.data.Result != 'undefined'){
		SimNumber=e.data.SimNumber;
		SimResult[SimNumber]=e.data.Result;
		
		//prompt a function that determines if all simulations are complete or not, then cleans up all remaining informations
		
		HCVTestResult=SimResult[SimNumber].HCVTestResult;
		console.log(HCVTestResult);
		RowLabel=[];
		for (i=0; i<HCVTestResult[0].length; i++){RowLabel[i]=i;}
		HCVResultsTable.innerHTML=MakeTableHTML(HCVTestResult, ["F0", "F1", "F2", "F3", "F4", "LF"], RowLabel);
	}
}


function HCVTest(){
	//Check that nothing else is running

	// Load information from form into population
	var SimData={};
	SimData.NoPeople=100000;
	// Set progress bar to zero
	MainProgress.value=0;

	// Create a simulation object

	// Start a webworker
	
	for (var SimNumber = 0; SimNumber < NoCores; SimNumber++) {
        var worker = new Worker("model/runsimulation.js");
        worker.onmessage = WorkerMessageHandler;
		
		
		
		
        // Sending canvas data to the worker using a copy memory operation
        worker.postMessage({ SimNumber: SimNumber, SimData: SimData });
    }

}

function HCVTestPlot(){
	// Get the relevant data
	HCVTestResult=SimResult[0].HCVTestResult;
	//create an x axis
	TimeAxis=[];
	for (i=0; i<HCVTestResult[0].length; i++){TimeAxis[i]=i;}
	// convert to a form that plot will accept
	PlotData=ConvertDataToLinePlot(TimeAxis, HCVTestResult);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	PlotSettings={xaxis: {
					axisLabel: 'Time (years)',
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					min: 0,
					max: 100000,
					axisLabel: 'Number of people',
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
	$.plot("#HCVTestPlotHolder", PlotData, PlotSettings);
	
	
	//var d1 = [];
	//for (var i = 0; i < 14; i += 0.5) {
	//	d1.push([i, Math.sin(i)]);
	//}

	//var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

	// A null signifies separate line segments

	//var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

	//$.plot("#HCVTestPlotHolder", [ d1, d2, d3 ]);
	//console.log([d1, d2, d3 ]);
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