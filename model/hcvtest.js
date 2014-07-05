
var onResultReturned = function (e) {
	console.log(e.data.Message);



}


function HCVTest(){
	//Check that nothing else is running

	// Load information from form into population

	// Set progress bar to zero

	// Create a simulation object

	// Start a webworker
	
	for (var SimNumber = 0; SimNumber < NoCores; SimNumber++) {
        var worker = new Worker("model/runsimulation.js");
        worker.onmessage = onResultReturned;
		
		DataGiven.a="yay ";
		
        // Sending canvas data to the worker using a copy memory operation
        worker.postMessage({ SimNumber: SimNumber, SimData: DataGiven });
    }

}