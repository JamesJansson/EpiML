
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
	LoadSettings();
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


function LoadDataFiles(){
	var AgeSexNotificationsCSV=new CSVFile('data/agesexnotifications.csv');
	
	//Data.MaleNotifications.Table=AgeSexNotificationsCSV.GetValues(1, 2, 5, 10);//get table indicates the range [rows][columns]
	//Data.MaleNotifications.Age=AgeSexNotificationsCSV.GetValues(1, 2, 5, 10);//GetColumn
	//Data.MaleNotifications.Year=AgeSexNotificationsCSV.GetValues(1, 2, 5, 10);//GetRow
	
	
	var StateNotificationsCSV=new CSVFile('data/statenotifications.csv');
	//Data.SummaryNotificationsTable=StateNotificationsCSV.GetValues(1, 2, 5, 10);
}


