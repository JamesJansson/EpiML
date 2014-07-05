

function HCVTest(){
	//Check that nothing else is running

	// Load information from form into population

	// Set progress bar to zero

	// Create a simulation object

	// Start a webworker
	
	for (var index = 0; index < NoCores; index++) {
        var worker = new Worker("model/runsimulation.js");
        worker.onmessage = onWorkEnded;

        // Getting the picture
        var canvasData = tempContext.getImageData(0, blockSize * index, canvas.width, blockSize);

        // Sending canvas data to the worker using a copy memory operation
        worker.postMessage({ data: canvasData, index: index, length: segmentLength });
    }

}