//Global variables for use in the program
var Settings={};
var Data={};
var ModelDirectory='model';
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
	
	TestingPageRequirements();	
	
	// Load settings
	LoadSettingsFiles();

	console.error(Settings);

	// Creating the parameter group
	PGroup= new ParameterGroup("PGroup", Settings.NumberOfSimulations, "./data/parameters.json");
	PGroup.Load();
	PGroup.CreateParameterPage("ParamHolder");
	Param=PGroup.ParamArray;
	
	// Load data
	LoadDataFiles();
	ExtractDataFromFiles();
	
	// Create the DataExtractionObject
	HCVDEOGroup=new DataExtractionObjectGroup("RandomGroup");
	HCVDEOGroup.AddDEO(HCVDataExtractionObjects());
	
	// Load the optimisation interface
	var Functions={};
	Functions.ModelFunction="FullModel";
	Functions.PreOptimisationFunction="SimSetup";
	Functions.PostOptimisationFunction="Postfunction";
	Functions.FunctionToRunOnCompletion="Math.random";
	
	var Common={};
	Common.Data=Data;
	
	// OptSelector(Name, DivID, Functions, PointerToParamGroup, DEOArrayFunctionName, Settings, ModelDirectory, Common)
	
	HCVOptSelector=new OptSelector('HCVOptSelector', 'HCVOptSelectorHolder', Functions, PGroup, 'HCVDataExtractionObjects',  Settings, ModelDirectory, Common);

	
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
	
	
	try {
		var SettingsFile=fs.readFileSync("./interface/settings.json", 'utf8');
	}
	catch(err){
		console.error("The file ./interface/settings.json could not be loaded. Error: ");
		console.error(err);
		throw "Stopping LoadSettingsFiles";
	}
	
	Settings = JSON.parse(SettingsFile);
	
	// Set up the HCV Treatment Scenarios
	SetupHCVTreatmentScenarioSelector();
	
	// Set up settings options
	var CheckboxValue;

	if (typeof(Settings.TerminateThreadOnSimCompletion)!="undefined"){
		CheckboxValue=Settings.TerminateThreadOnSimCompletion;
	}
	else {
		CheckboxValue=false;
	}
	document.getElementById('TerminateThreadOnSimCompletionCheckbox').checked=CheckboxValue;
	
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

	
	
	// fs.readFile("./interface/settings.json", 'utf8', function (err, data) {
	// 	if (err){
	// 		console.error("The ./interface/settings.json file could not be loaded. Using default values. Error: ");
	// 		console.log(err);
	// 		// Use default values
	// 		Settings.NoThreads=1;// number of cores to use at a time
	// 		Settings.SampleFactor=10;// This value is the number of people each person in the simulation represents. Probably a good idea to set this to 1, 10 or 100
	// 	}
	// 	else{
	// 		Settings = JSON.parse(data);
	// 	}
		
	// 	// Set up the HCV Treatment Scenarios
	// 	SetupHCVTreatmentScenarioSelector();
		
	// 	// Set up settings options
	// 	var CheckboxValue;

	// 	if (typeof(Settings.TerminateThreadOnSimCompletion)!="undefined"){
	// 		CheckboxValue=Settings.TerminateThreadOnSimCompletion;
	// 	}
	// 	else {
	// 		CheckboxValue=false;
	// 	}
	// 	document.getElementById('TerminateThreadOnSimCompletionCheckbox').checked=CheckboxValue;
		
	// 	if (typeof(Settings.RecalculateParam)!="undefined"){
	// 		CheckboxValue=Settings.RecalculateParam;
	// 	}
	// 	else {
	// 		CheckboxValue=false;
	// 	}
	// 	document.getElementById('RecalculateParamCheckbox').checked=CheckboxValue;
		
	// 	console.error("Note: all the below should have checking and defaults implemented as above.");		
	// 	document.getElementById("NumberOfSimulationsTextbox").value=Settings.NumberOfSimulations;
	// 	document.getElementById("NoThreadsDropdown").value=Settings.NoThreads;
	// 	document.getElementById("SampleFactorTextbox").value=Settings.SampleFactor;
	// });
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