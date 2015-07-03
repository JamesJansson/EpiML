//Global variables for use in the program
var Settings={};
var Data={};
var Param=[];//An array of parameters, legacy
var PGroup;
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

	
function InitialiseEpiML(){
	// Load data
	TestingPageRequirements();	
	LoadSettingsFiles();

	
	PGroup= new ParameterGroup("PGroup", Settings.NumberOfSimulations);
	PGroup.Load("./data/parameters.json");
	PGroup.CreateParameterPage("ParamHolder");
	Param=PGroup.ParamArray;
	
	LoadDataFiles();
	ExtractDataFromFiles();
	
	console.log("EpiML initialised")
}

function TestingPageRequirements(){
	//Testing the required elements for EpiML
	//Web workers
	if(typeof(Worker) == "undefined") {
		alert("Webworkers are not supported in this browser. EpiML requires webworkers to run. Try upgrading your browser");
	}
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
			Settings.SampleFactor=10;// This value is the number of people each person in the simulation represents. Probably a good idea to set this to 1, 10 or 100
		}
		else{
			Settings = JSON.parse(data);
		}
		
		// Set up the HCV Treatment Scenarios
		SetupHCVTreatmentScenarioSelector();
		
		// Set up settings options
		var CheckboxValue;

		if (typeof(Settings.ModelNetwork)!="undefined"){
			CheckboxValue=Settings.ModelNetwork;
		}
		else {
			CheckboxValue=false;
		}
		document.getElementById('ModelNetworkCheckbox').checked=CheckboxValue;
		
		if (typeof(Settings.RecalculateParam)!="undefined"){
			CheckboxValue=Settings.RecalculateParam;
		}
		else {
			CheckboxValue=false;
		}
		document.getElementById('RecalculateParamCheckbox').checked=CheckboxValue;
		
		
		
		
		console.error("Note: all the below should have checking and defaults implemented as above.");		
		document.getElementById("NumberOfSimulationsTextbox").value=Settings.NumberOfSimulations;
		document.getElementById("NoThreadsDropdown").value=Settings.NoThreads;
		document.getElementById("SampleFactorTextbox").value=Settings.SampleFactor;
	});
}

function SaveSettings(){
	var SettingsJSONString=JSON.stringify(Settings, null, 4);//gives 4 spaces between elements
	//var blob = new Blob([SettingsJSONString], {type: "text/plain;charset=utf-8"});
	
	fs.writeFile("./interface/settings.json", SettingsJSONString , function(err) {
		if(err) {
			alert("There was an error writing to the settings.json file. See console for details.");
			console.log(err);
		}
	});
}




function SetupHCVTreatmentScenarioSelector(){
    var SelectorObj = document.getElementById("HCVTreatmentScenarioSelector");
	
	// Create the drop down options
	for (var ScenarioID in HCVTreatmentScenario){
	    var optionobj = document.createElement("option");
	    optionobj.text = HCVTreatmentScenario[ScenarioID].Name;
	    optionobj.value = ScenarioID;
	    SelectorObj.add(optionobj);
	}
	
	// Select the relevant drop down option
	if (typeof(Settings.HCVTreatmentScenario)!="undefined"){
		SelectorObj.value=Settings.HCVTreatmentScenario;
	}
	else {
		SelectorObj.value=0;
	}
	UpdateHCVTreatmentScenarioSelector(SelectorObj.value);
}

function UpdateHCVTreatmentScenarioSelector(ScanrioNum){
	document.getElementById('HCVTreatmentScenarioDescription').value=HCVTreatmentScenario[ScanrioNum].Description;
	document.getElementById('HCVTreatmentScenarioCode').value=HCVTreatmentScenario[ScanrioNum].Function;
}