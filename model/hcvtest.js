
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
		
		console.log(SimResult[SimNumber].HCVTestResult);
		
		RowLabel=[];
		for (i=0; i<SimResult[SimNumber].HCVTestResult[0].length; i++){RowLabel[i]=i;}
		
		HCVResultsTable.innerHTML=MakeTableHTML(SimResult.HCVTestResult, ["F0", "F1", "F2", "F3", "F4", "LF"], RowLabel);
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
	PlotData=ConvertDataToPlot(TimeAxis, SimResult[0].HCV);
	$.plot("#HCVTestPlotHolder", PlotData);
	var d1 = [];
	for (var i = 0; i < 14; i += 0.5) {
		d1.push([i, Math.sin(i)]);
	}

	var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

	// A null signifies separate line segments

	var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

	$.plot("#HCVTestPlotHolder", [ d1, d2, d3 ]);
	console.log([d1, d2, d3 ]);
}

function ConvertDataToLinearPlot(InputMatrix){//Accepts [param][time] or [y][x]. Future systems will accept [param][time][sim]
	return 
}