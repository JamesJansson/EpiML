//Specify files to be included in the simulation
DebugLoadingScripts=true;

importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("mathtools.js");
importScripts("stochasticoptimisation.js");
// Model specific functions
importScripts("person.js");
importScripts("hcv.js");
importScripts("hiv.js");
importScripts("assignpopulation.js");
importScripts("extractresults.js");
importScripts("populationstatistics.js");
importScripts("generalmortality.js");

var Data={};
var Param={};//This is the parameter holder for the simulation
var CommonParam={};
var PP=[];//This is the global array that holds the population
var SimID;//This value is a global, used to reference the correct simulation in the Param structure
var PPNotification=[];

var MaleMortality;
var FemaleMortality;
var IndigenousMaleMoratlity;
var IndigenousFemaleMoratlity;

var ShowDebugStatements=true;
function DebugStatement(ConsoleMessage){
	if (ShowDebugStatements){
		console.log(ConsoleMessage);
	}
}


self.onmessage = function (WorkerMessage) {

	
	//In this section will be a message handler that allows calls
	// Initialise (set data and parameters)
	// Optimise (find unknown parameters)
	// Initialise with optimised data
	// Extrapolate (with current settings)
	// Intervention (with changed settings)
	// Get data
	// Save
	
	// if intervention function is defined
	//    go to intervention function. evaluate the function that executes at time=t

	self.postMessage({Console: WorkerMessage.data});//This passes the data back to the console so we can look at it
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated
	var TimerStart = new Date().getTime() / 1000;
	
	//Load the notification data
	Data=WorkerMessage.data.Common.Data;
	//Load the parameters data
	CommonParam=WorkerMessage.data.Common.Param;
	// Load simulation settings
	var Settings=WorkerMessage.data.Common.Settings;
	
	SimID = WorkerMessage.data.SimID; // this value is used to select the appropriate parameter value
    var SimData = WorkerMessage.data.SimData;
	var ThreadID = WorkerMessage.data.ThreadID;// this value can be used by the code to send specific messages to particular elements, e.g. progress bar 4 set to 60%
	
	console.log("thread: "+ThreadID+" simID: "+SimID);
	
	// Load up mortality data
	MaleMortality=new MortalityCalculator(CommonParam.MaleMortality.Rates1, CommonParam.MaleMortality.Year1, CommonParam.MaleMortality.Rates2, CommonParam.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(CommonParam.FemaleMortality.Rates1, CommonParam.FemaleMortality.Year1, CommonParam.FemaleMortality.Rates2, CommonParam.FemaleMortality.Year2);
	
	self.postMessage({Console: MaleMortality});
	
	
	var IncrementSize=Math.round(SimData.NoPeople/100);//used to deliver progress rates back to the progress bar
	
	var GenotypeValue=1;

	
	var HCVParam={};
	HCVParam.F0F1=0.117;
	HCVParam.F1F2=0.085;
	HCVParam.F2F3=0.12;
	HCVParam.F3F4=0.116;
	HCVParam.F4LF=0.055;//not real
	HCVParam.F4HCC=0.031;//not real
	// Grebely http://www.ncbi.nlm.nih.gov/pubmed/23908124
	HCVParam.SpontaneousClearance=0.296;// 4 year probability of clearance
	HCVParam.YearlyRateOfClearanceInClearers=0.666; // proportion (of the 29.6% of people who will clear) clearing each year
	
	HCVParam.F0Mortality=0;
	HCVParam.F1Mortality=0;
	HCVParam.F2Mortality=0;
	HCVParam.F3Mortality=0;
	HCVParam.F4Mortality=0;
	HCVParam.LFMortality=0;
	HCVParam.HCCMortality=0;
	
	
	DebugStatement("Starting to load Person object");
	
	PPNotification=AssignPopulation(Data, Settings.SampleFactor);
	// For each person in the simulation 
	// Determine a random time that they have been infected for (lognormally distributed about 5 years previously, SD 2.5 years)
	
	console.log(PPNotification.length);
	
	var TimerFinish = new Date().getTime() / 1000;
    var TotalTime=TimerFinish -TimerStart;
	DebugStatement("Memory allocation stopped after "+TotalTime+" seconds");
	
	DebugStatement("Starting to HCV progression");
	
	var YearOfInfection;
	var YearOfDiagnosis;
	for (var i=0; i<PPNotification.length; i++){
		
		//TimeUntilDiagnosis=NormalRand(5, 2.5);//this may end up being lognormal
		TimeUntilDiagnosis=TimeUntilEvent(0.10);//this may end up being lognormal
		
		if (TimeUntilDiagnosis<0){TimeUntilDiagnosis=0}//correct 
		
		YearOfDiagnosisVector=PPNotification[i].HCV.Diagnosed.TimeOf(1);//Returns when "Diagnosed==1"
		YearOfDiagnosis=YearOfDiagnosisVector[0];
		YearOfInfection=YearOfDiagnosis-TimeUntilDiagnosis;// Zero is the first year of diagnosis
		
		PPNotification[i].HCVInfection(YearOfInfection, GenotypeValue, HCVParam );//In future iterations, HCVParam will become Param.HCV
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}

		PPNotification[i].CalculateGeneralMortality(YearOfDiagnosis); // Calculate date of mortality from the date of diagnosis
		PPNotification[i].CalculateHCVMortality(YearOfDiagnosis);
	}
	
	
	//if (true){
		var SaySomething={};
		SaySomething.Data="This is data";
		SaySomething.Code="console.log(Data);";
		self.postMessage({Execute: SaySomething});
		
		var PlotSomething={};
		PlotSomething.Data=[[0, 3], [4, 8], [8, 5], [9, 13]];
		PlotSomething.Code="ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');";
		self.postMessage({Execute: PlotSomething});
		
		
		A=TestStochasticOptimisation();
	//}
	
	
	
	DebugStatement("Beginning estimates of undiagnosed HCV");
	// This method assumes that all people test at the same rate. 
	// At this point, we'll assume 90% of people are diagnosed at 20 years of 
	
	
	TimerFinish = new Date().getTime() / 1000;
    TotalTime=TimerFinish -TimerStart;
	DebugStatement("Finished simulating population at "+TotalTime+" seconds");


	// Extract results of simulation
	DebugStatement("Extracting results");
	
	var StatsTime={};
	StatsTime.Start=1980;
	StatsTime.Stop=2030;
	StatsTime.Step=1;
	
	var SimResult={};
	SimResult.FibrosisCount=CountFibrosisStages(PPNotification, Settings.SampleFactor, StatsTime);//Determine fibrosis levels with year
	SimResult.DiagnosisCount=LivingDxAndUDx(PPNotification, Settings.SampleFactor, StatsTime);//Determine fibrosis levels with year
	SimResult.AgeInfectedResult=AnalyseAgeInfected(PPNotification, StatsTime);
	

	DebugStatement("Total individuals in model: " + PPNotification.length);
		
	TimerFinish = new Date().getTime() / 1000;
    TotalTime=TimerFinish -TimerStart;
	DebugStatement("Finished full simulation in "+TotalTime+" seconds");
	
	//PPNotification[0].CalculateMortality();
	
	//Saving simulation results into local storage
	
	
	self.postMessage({WorkerMessage: WorkerMessage.data, Result: SimResult});//All simulation will end with this line
};
