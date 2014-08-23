
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

	
	
function InitialisePage(){
	//LoadData();
	//LoadSettings();
	//LoadParameters();
	Param={};
	Param.HCV={};
	Param.HCV.AAA=new ParameterClass('AAA');
	Param.HCV.BBB=new ParameterClass('BBB');
	//Initialise interface
	BuildParameterPage(Param.HCV, "HCVParamHolder");
}