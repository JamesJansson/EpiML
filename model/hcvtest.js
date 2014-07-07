
var SimResult;

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
		SimResult=e.data.Result;
		console.log(SimResult.HCVTestResult);
		
		RowLabel=[];
		for (i=0; i<SimResult.HCVTestResult[0].length; i++){RowLabel[i]=i;}
		
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