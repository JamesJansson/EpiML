
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
var Data={};
	
function InitialisePage(){
	LoadDataFiles();
	LoadSettingsFiles();
	LoadParametersFiles();
	Param={};
	Param.HCV={};
	Param.HCV.AAA=new ParameterClass('AAA');
	Param.HCV.AAA.Description="This is what will appear in the textarea box";
	Param.HCV.BBB=new ParameterClass('BBB');
	//Initialise interface
	BuildParameterPage(Param.HCV, "HCVParamHolder", "Param.HCV");
}




function LoadSettingsFiles(){
	//Load settings/settings.json
	
	// Note this does not require the script to wait
	// For all of the settings that have not been set 
	// if Settings.NoCores=
	Settings.NoCores=1;// number of cores to use at a times
	Settings.ConcurrentSims=10;// number of sims to keep active at once (for interface playing)
}

function LoadParametersFiles(){

}

function LoadDataFiles(){
	var AgeSexNotificationsCSV=new CSVFile('data/agesexnotifications.csv');
	var StateNotificationsCSV=new CSVFile('data/statenotifications.csv');
	
	
	//Data.MaleNotifications.Table=AgeSexNotificationsCSV.GetValues(1, 2, 5, 10);//get table indicates the range [rows][columns]
	//Data.MaleNotifications.Age=AgeSexNotificationsCSV.GetColumn(1, 2, 5, 10);//GetColumn
	//Data.MaleNotifications.Year=AgeSexNotificationsCSV.GetRow(1, 2, 5, 10);//GetRow
	
	
	
	//Data.SummaryNotificationsTable=StateNotificationsCSV.GetValues(1, 2, 5, 10);
}


