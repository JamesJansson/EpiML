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
var Settings={};

var OptimisedParam={};// The results are stored both here and in Param

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
	Settings=WorkerMessage.data.Common.Settings;
	
	SimID = WorkerMessage.data.SimID; // this value is used to select the appropriate parameter value
    var SimData = WorkerMessage.data.SimData;
	var ThreadID = WorkerMessage.data.ThreadID;// this value can be used by the code to send specific messages to particular elements, e.g. progress bar 4 set to 60%
	
	var StringForStatus="thread: "+ThreadID+" simID: "+SimID;
	self.postMessage({StatusText: StringForStatus, StatusTextID: ThreadID});
	
	
	// Load up mortality data
	MaleMortality=new MortalityCalculator(CommonParam.MaleMortality.Rates1, CommonParam.MaleMortality.Year1, CommonParam.MaleMortality.Rates2, CommonParam.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(CommonParam.FemaleMortality.Rates1, CommonParam.FemaleMortality.Year1, CommonParam.FemaleMortality.Rates2, CommonParam.FemaleMortality.Year2);
	
	self.postMessage({Console: MaleMortality});
	
	// Adjust data according to beliefs about inaccuracies 
	AdjustData();
	
	
	
	
	// Perform an optimisation of the number of injectors
	if (true){
	// Get the data for the numbers by sex and age
		//EntryRateOptimisation();
	}
	
	
	// Run an example simulation
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
	
	// This section contains testing code which is not used at the moment
	if (false){
		var SaySomething={};
		SaySomething.Data="This is data";
		
		self.postMessage({Execute: SaySomething});
		
		var PlotSomething={};
		PlotSomething.Data=[[0, 3], [4, 8], [8, 5], [9, 13]];
		PlotSomething.Code="ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');";
		self.postMessage({Execute: PlotSomething});
		
		
		A=TestStochasticOptimisation();
	}
	
	
	
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
	SimResult.LivingWithHCV=CountLivingWithHCV(PPNotification, Settings.SampleFactor, StatsTime);// Determines a simple count of people living with HCV by year

	DebugStatement("Total individuals in model: " + PPNotification.length);
		
	TimerFinish = new Date().getTime() / 1000;
    TotalTime=TimerFinish -TimerStart;
	DebugStatement("Finished full simulation in "+TotalTime+" seconds");
	
	//PPNotification[0].CalculateMortality();
	
	//Saving simulation results into local storage
	
	// Run the same simulation, but this time with the proposed intervention starting at the time of the intervention
	
	
	// SimResult should be structured as follows
	// SimResult.OptimisedValues // if they were previously optimised, they should stay that way
	// SimResult.Intervention[0] // the baseline result. 
	// SimResult.Intervention[1] // the first intervention result. Should contain 
	// SimResult.Intervention[1].Instructions 
	// SimResult.Intervention[1].Instructions[0].Time // the year that the intervention takes place
	//
	// 
	// SimResult.Intervention[1].Results 
	
	
	
	self.postMessage({WorkerMessage: WorkerMessage.data, Result: SimResult});//All simulation will end with this line
};

function AdjustData(){
	var AdjustmentFactor=1.2;
	AdjustPWID(Data, AdjustmentFactor);
	
	
	
	self.postMessage({Console: Data});
}





function AdjustPWID(Data, AdjustmentFactor){
	Data.AdjustedPWID={};
	Data.AdjustedPWID.Ever={};
	Data.AdjustedPWID.Ever.Male=Multiply(Data.PWID.Ever.Male, AdjustmentFactor);
	Data.AdjustedPWID.Ever.Female=Multiply(Data.PWID.Ever.Female, AdjustmentFactor);
	Data.AdjustedPWID.Recent={};
	Data.AdjustedPWID.Recent.Male=Multiply(Data.PWID.Recent.Male, AdjustmentFactor);
	Data.AdjustedPWID.Recent.Female=Multiply(Data.PWID.Recent.Female, AdjustmentFactor);
}



function EntryRateOptimisation(){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	// this is a multistage optimisation that requires the optimisation of the first data points followed by subsequent ones.
	// First step is to model the increase in the number of people starting drug use in the lead up to 1998
	// From that point on, we adjust the entry rate every 3 years (with interpolation)
	
	// Start off with all parameters set to zero
	var FunctionInput={};
	var EntryRateOptimisationSettings={};
	
	//FunctionInput.NumberOfSamples=1000;
	
	// FunctionInput.EntryParams=FunctionInput.PWID;
	
	// Do the first range that increases up to 1998
	EntryRateOptimisationSettings.Target=Data.PWID;
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		FunctionInput.EntryParams.logk=ParametersToOptimise.logk;
		FunctionInput.EntryParams.expA=ParametersToOptimise.expA;
		// FunctionInput.EntryParams.EndExponential=1998;// Beginning of 1998
		// FunctionInput.EntryParams.FirstYear=1958;// Beginning of 1958 (40 years earlier) is the earliest we consider injection drug use
		// FunctionInput.EntryParams.MedianEntryAge = 21; (from 
		// FunctionInput.EntryParams.MedianEntryAgeLogSD = 0.XXXXX; (from 
		// 
		
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimate=1.2;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateLowerRange=1.0;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateUpperRange=1.4;
		
		
		// PWIDPopulation=DistributePWIDPopulation(FunctionInput.EntryParams, FunctionInput.MaxYear);//Returns PWIDPopulation as defined to the MaxYear
	
		// Determine drug related mortality - use Australian cause of death statistics
		// page 71 of the 2001 social trends will be good enough for this
		// http://www.ausstats.abs.gov.au/ausstats/subscriber.nsf/0/6AB30EFAC93E3F5CCA256A630006EA93/$File/41020_2001.pdf
		// http://www.abs.gov.au/AUSSTATS/abs@.nsf/2f762f95845417aeca25706c00834efa/a96b3196035d56c0ca2570ec000c46e5!OpenDocument 
		// 1737 in 1999, 72% were male in 1999
		// 734 in 1979, 49% were male in 1979
		// Interpolate for periods in between
		// 
		// This gives drug-induced death rates by age groups in years 2000 to 2012
		// "4125.0 Gender Indicators, Australia, August 2014"
		// http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/4125.0August%202014?OpenDocument 
		// Multiplying this out by the age groups should give the right number of deaths
		
		
		// Optimise staying and leaving rate for this period
		
		var Results={};
		Results.PWIDPopulation=PWIDPopulation;
	
		//console.log(ParametersToOptimise);
		//console.log(ParametersToOptimise.Y);
		//var Results=NormalRandArray(ParametersToOptimise.X, ParametersToOptimise.Y, FunctionInput.NumberOfSamples);
		return Results;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
		// Look at Results.People
		// Count the distribution at given dates
			// Use the CountStatistic to determine the numbers in specific groups
		var Value=new CountStatistic();
			
			
		var CurrentHistogramsResults=HistogramData(Results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		var TotalError=Sum(Abs(Minus(CurrentHistogramsResults.Count, Target)));
		return TotalError;
	};
	
	// EntryRateOptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimResults, ErrorValues){
		// console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
		// PSetCount=0;
		// Data=[];
		// for (var key in Parameter.X.CurrentVec){
			// Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
			// PSetCount++;
		// }
		
		// PlotSomething={};
		// PlotSomething.Data=Data;
		// PlotSomething.Code="FixedAxisScatterPlot('#PlotHolder', Data,  'AAA', 'BBB', 0, 10, 0, 10);";
		// self.postMessage({Execute: PlotSomething});
		
		
		// ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
	// };
	
	EntryRateOptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("logk", 0, 1);
	OptimisationObject.AddParameter("expA", 0, 100000);
	OptimisationObject.Run(FunctionInput);
	
	
	return OptimisationObject;

}

function EntryRateOptimisationExponentialGrowth(){

}

