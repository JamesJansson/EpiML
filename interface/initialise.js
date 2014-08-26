//Global variables for use in the program
var Settings={};
var Data={};
var Param={};
var DataFile={};



// Setting up flags
	var SimulationRunning=0;//set to 1 if running

// Settings
	var NoCores=1;

	
function InitialisePage(){
	TestingPageRequirements();
	LoadDataFiles();
	LoadSettingsFiles();
	LoadParametersFiles();
	
	//Wait?
	
	
	Param={};
	Param.HCV={};
	Param.HCV.AAA=new ParameterClass('AAA');
	Param.HCV.AAA.Description="This is what will appear in the textarea box";
	Param.HCV.BBB=new ParameterClass('BBB');
	//Initialise interface
	BuildParameterPage(Param.HCV, "HCVParamHolder", "Param.HCV");
}

function TestingPageRequirements(){
	//Testing the required elements for EpiML
	//Web workers
	if(typeof(Worker) == "undefined") {
	alert("Webworkers are not supported in this browser. EpiML requires webworkers to run. Try upgrading your browser");
	}
	//Local storage

}


function LoadSettingsFiles(){
	//Load settings/settings.json
	
	// Note this does not require the script to wait
	// For all of the settings that have not been set 
	// if Settings.NoCores=
	Settings.NoCores=1;// number of cores to use at a time
	Settings.ConcurrentSims=10;// number of sims to keep active at once (for interface playing)
}

function LoadParametersFiles(){
	Param.SampleFactor=10;// This value is the number of people each person in the simulation represents. Probably a good idea to set this to 1, 10 or 100
}

function LoadDataFiles(){
	DataFile.AgeSexNotifications=new CSVFile('data/agesexnotifications.csv');
	DataFile.StateNotifications=new CSVFile('data/statenotifications.csv');
	
	

}


