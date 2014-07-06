
var WorkerMessageHandler = function (e) {
	//console.log(e.data.result);

	// There are 3 main 
	// Messages to the console
	// Messages to the StatusText
	// Messages to the ProgressBar
	// Message to indicate completeness
	
	// Messages to the console
	if (typeof e.data.ConsoleMessage != 'undefined'){
		console.log(e.data.ConsoleMessage);
	}
	// Messages to the ProgressBar
	if (typeof e.data.ProgressBarValue != 'undefined'){
		MainProgress.value=e.data.ProgressBarValue;
	}


}


function HCVTest(){
	//Check that nothing else is running

	// Load information from form into population

	// Set progress bar to zero
	MainProgress.value=0;

	// Create a simulation object

	// Start a webworker
	
	for (var SimNumber = 0; SimNumber < NoCores; SimNumber++) {
        var worker = new Worker("model/runsimulation.js");
        worker.onmessage = WorkerMessageHandler;
		
		DataGiven="yay ";
		
        // Sending canvas data to the worker using a copy memory operation
        worker.postMessage({ SimNumber: SimNumber, SimData: DataGiven });
    }

}