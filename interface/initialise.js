
//Testing the required elements for EpiML
	//Web workers
	if(typeof(Worker) == "undefined") {
	alert("Webworkers are not supported in this browser. EpiML requires webworkers to run. Try upgrading your browser");
	}
	//Local storage

	
// Setting up flags
	var SimulationRunning=0;//set to 1 if running

// Settings
	var NoCores=1;

	//LoadData();
	//LoadSettings();
	//LoadParameters();