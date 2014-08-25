
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

var Settings={};
	
function InitialisePage(){
	//LoadData();
	//LoadSettings();
	//LoadParameters();
	Param={};
	Param.HCV={};
	Param.HCV.AAA=new ParameterClass('AAA');
	Param.HCV.AAA.Description="This is what will appear in the textarea box";
	Param.HCV.BBB=new ParameterClass('BBB');
	//Initialise interface
	BuildParameterPage(Param.HCV, "HCVParamHolder", "Param.HCV");
}

function LoadSettings(){
	Settings.NoCores=1;// number of cores to use at a times
	Settings.ConcurrentSims=10;// number of sims to keep active at once (for interface playing)
	


}