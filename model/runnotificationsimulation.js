//Specify files to be included in the simulation
DebugLoadingScripts=true;

importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("mathtools.js");
importScripts("person.js");
importScripts("hcv.js");
importScripts("hiv.js");
importScripts("assignpopulation.js");
importScripts("extractresults.js");
importScripts("summarystats.js");
importScripts("generalmortality.js");

var Param={};//This is the parameter holder for the simulation
var PP=[];//This is the global array that holds the population
var SimID;//This value is a global, used to reference the correct simulation in the Param structure
var PPNotification=[];

var MaleMortality;
var FemaleMortality;
var IndigenousMaleMoratlity;
var IndigenousFemaleMoratlity;


self.onmessage = function (e) {

	
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

	self.postMessage({Console: e.data});//This passes the data back to the console so we can look at it
	
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated
	
	var TimerStart = new Date().getTime() / 1000;
	
	
	//Load the notification data
	var Data=e.data.Common.Data;
	//Load the parameters data
	var Param=e.data.Common.Param;
	
	var SimID = e.data.SimNumber; // this value is used to select the appropriate parameter value
    var SimData = e.data.SimData;
	
	
	// Load up mortality data
	MaleMortality=new MortalityCalculator(Param.MaleMortality.Rates1, Param.MaleMortality.Year1, Param.MaleMortality.Rates2, Param.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(Param.FemaleMortality.Rates1, Param.FemaleMortality.Year1, Param.FemaleMortality.Rates2, Param.FemaleMortality.Year2);
	
	//CalculateMaleMortality=23;
	
	
	var IncrementSize=Math.round(SimData.NoPeople/100);//used to deliver progress rates back to the progress bar
	
	var GenotypeValue=1;

	
	var HCVParam={};
	HCVParam.F0F1=0.117;
	HCVParam.F1F2=0.085;
	HCVParam.F2F3=0.12;
	HCVParam.F3F4=0.116;
	HCVParam.F4LF=0.0001;//not real
	HCVParam.F4HCC=0.4;//not real
	// Grebely http://www.ncbi.nlm.nih.gov/pubmed/23908124
	HCVParam.SpontaneousClearance=0.296;// 4 year probability of clearance
	HCVParam.YearlyRateOfClearanceInClearers=0.666; // proportion (of the 29.6% of people who will clear) clearing each year
	

	console.log("Starting to load Person object");
	
	
	PPNotification=AssignPopulation(Data, Param);
	// For each person in the simulation 
	// Determine a random time that they have been infected for (lognormally distributed about 5 years previously, SD 2.5 years)
	
	
	
	var TimerFinish = new Date().getTime() / 1000;
    var TotalTime=TimerFinish -TimerStart;
	console.log("Memory allocation stopped after "+TotalTime+" seconds");
	
	console.log("Starting to HCV progression");
	
	var YearOfInfection;
	var YearOfDiagnosis;
	for (var i=0; i<PPNotification.length; i++){
		
		//TimeUntilDiagnosis=NormalRand(5, 2.5);//this may end up being lognormal
		TimeUntilDiagnosis=TimeUntilEvent(0.10);//this may end up being lognormal
		
		if (TimeUntilDiagnosis<0){TimeUntilDiagnosis=0}//correct 
		
		YearOfDiagnosis=PPNotification[i].HCV.Diagnosed.TimeOf(1);//Returns when "Diagnosed==1"
		YearOfInfection=YearOfDiagnosis[0]-TimeUntilDiagnosis;// Zero is the first year of diagnosis
		
		PPNotification[i].HCVInfection(YearOfInfection, GenotypeValue, HCVParam );//In future iterations, HCVParam will become Param.HCV
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
		
		PPNotification[i].CalculateMortality(YearOfDiagnosis);//In future iterations, HCVParam will become Param.HCV
	}
	
	
	console.log("Extracting results");
	var SimResult={};

	SimResult.FibrosisCount=CountFibrosisStages(PPNotification, Param.SampleFactor);//Determine fibrosis levels with year
	
	
	
	TimerFinish = new Date().getTime() / 1000;
    TotalTime=TimerFinish -TimerStart;

	console.log("Total individuals in model: " + PPNotification.length);
	console.log("Finished simulation in "+TotalTime+" seconds");
	
	//PPNotification[0].CalculateMortality();
	
	//Saving simulation results into local storage
	
	
	self.postMessage({SimNumber: e.data.SimNumber, Result: SimResult});//All simulation will end with this line
};
