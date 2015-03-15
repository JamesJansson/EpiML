//Global variables for use in the program
var Settings={};
var Data={};
var Param=[];//An array of parameters
var DataFile={};
var SimulationHolder;
var SimOutput;
var AggregatedResults;

// Setting up whether it is working under NodeJS or not
RunningNodeJS=true;

// Load some of the required packages
var fs = require('fs');




// Setting up flags
var SimulationRunning=0;//set to 1 if running



	
function InitialisePage(){
	TestingPageRequirements();
	LoadDataFiles();
	LoadSettingsFiles();
	Param=LoadParameters();
	
	//Wait?
	
	
	
	// Param.HCV={};
	// Param.HCV.AAA=new ParameterClass('AAA');
	// Param.HCV.AAA.Description="This is what will appear in the textarea box";
	// Param.HCV.BBB=new ParameterClass('BBB');
	
	//Param.HCV.F0F1;
	
	// 
	
	//Initialise interface
	//Param=[];
	//Param=LoadParameters();
	PPage=new ParameterPage(Param, "Param", "PPage", "ParamHolder", 100);
	PPage.Build();
	
	
	
	//BuildParameterPage(Param.HCV, "HCVParamHolder", "Param.HCV");
	
	
	console.log("It might be a good idea to compress simulation output to save on time using LZAA in lz-string http://pieroxy.net/blog/pages/lz-string/demo.html");
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
	//if // the settings file exists
	// load the settings file
	
	
	fs.readFile("./interface/settings.json", 'utf8', function (err, data) {
		if (err){
			console.error("The ./interface/settings.json file could not be loaded. Using default values. Error: ");
			console.log(err);
			// Use default values
			Settings.NoThreads=1;// number of cores to use at a time
			Settings.ConcurrentSims=8;// number of sims to keep active at once (for interface playing)
			Settings.SampleFactor=10;// This value is the number of people each person in the simulation represents. Probably a good idea to set this to 1, 10 or 100
		}
		else{
			Settings = JSON.parse(data);
		}
		document.getElementById("NumberOfSimulationsTextbox").value=Settings.NumberOfSimulations;
		document.getElementById("NoThreadsDropdown").value=Settings.NoThreads;
		document.getElementById("ConcurrentSimsDropdown").value=Settings.ConcurrentSims;
		document.getElementById("SampleFactorTextbox").value=Settings.SampleFactor;
	});
	
	
}

function SaveSettings(){
	var SettingsJSONString=JSON.stringify(Settings, null, 4);//gives 4 spaces between elements
	var blob = new Blob([SettingsJSONString], {type: "text/plain;charset=utf-8"});
	
	fs.writeFile("./interface/settings.json", SettingsJSONString , function(err) {
		if(err) {
			alert("There was an error writing to the settings.json file. See console for details.");
			console.log(err);
		}
	});
}








function LoadDataFiles(){
	DataFile.AgeSexNotifications=new CSVFile('./data/hcv_notifications_agesex.csv');
	DataFile.StateNotifications=new CSVFile('./data/hcv_notifications_state.csv');
	
	DataFile.MaleMortality=new CSVFile('./data/mortality_males_alltables_qx.csv');
	DataFile.FemaleMortality=new CSVFile('./data/mortality_females_alltables_qx.csv');
	DataFile.PWID=new CSVFile('./data/pwid_size.csv');
	DataFile.GeneralPopulation=new CSVFile('./data/generalpopulation.csv');
	

	// Originally it was thought this would run both in a web browser and in nw.js. Now it will only run in nw.js 
	// var RunOther=true;if (typeof (RunningNodeJS)!=='undefined'){console.log("got in1");if (RunningNodeJS==true){RunOther=false;
		// console.log("got in2");
		// DataFile.AgeSexNotifications=new CSVFile('./data/hcv_notifications_agesex.csv');
		// DataFile.StateNotifications=new CSVFile('./data/hcv_notifications_state.csv');
		
		// DataFile.MaleMortality=new CSVFile('./data/mortality_males_alltables_qx.csv');
		// DataFile.FemaleMortality=new CSVFile('./data/mortality_females_alltables_qx.csv');
		// DataFile.PWID=new CSVFile('./data/pwid_size.csv');
	// }}
	// if (RunOther){
		// console.log("got in3");
		// DataFile.AgeSexNotifications=new CSVFile('data/hcv_notifications_agesex.csv');
		// DataFile.StateNotifications=new CSVFile('data/hcv_notifications_state.csv');
		
		// DataFile.MaleMortality=new CSVFile('data/mortality_males_alltables_qx.csv');
		// DataFile.FemaleMortality=new CSVFile('data/mortality_females_alltables_qx.csv');
		// DataFile.PWID=new CSVFile('data/pwid_size.csv');
	// }

}


