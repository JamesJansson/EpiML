// model.js is where the main functions are kept for the model

//Specify files to be included in the simulation
var DebugLoadingScripts=true;

var Data={};

var Param={};//This is the parameter holder for the simulation. It is global in scope and changes as optimisation and interventions adjust it
var OriginalParam={}; // This is a space to store param 
var OptimisedParam={};// This is the Param object which includes values for the optimised param 
var InterventionParam={};// This is the 

var Settings={};



var PP=[];//This is the global array that holds the population
var SimID;//This value is a global, used to reference the correct simulation in the Param structure
var PPNotification=[];

var MaleMortality;
var FemaleMortality;
var IndigenousMaleMortality;
var IndigenousFemaleMortality;

var ShowDebugStatements=false;
function DebugStatement(ConsoleMessage){
	if (ShowDebugStatements){
		console.log(ConsoleMessage);
	}
}

function NotificationBackProjection(WorkerData){
	//
	
	//In this section will be a message handler that allows calls
	// Initialise (set data and parameters)
	// Optimise (find unknown parameters)
	// Send Optimised data back to Simulation Manager to be saved
	// Initialise with optimised data
	// Extrapolate (with current parameter estimates and no interventions)
	// Intervention (with changed parameter estimates and interventions)
	// Get data
	// Save
	
	// if intervention function is defined
	//    go to intervention function. evaluate the function that executes at time=t
	
	DebugStatement("Data passed to the simulation");
	DebugStatement(WorkerData);//This passes the data back to the console so we can look at it
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated
	var TimerStart = new Date().getTime() / 1000;
	
	//Load the notification data
	Data=WorkerData.Common.Data;
	//Load the parameters data
	Param = WorkerData.SimData;
	
	
	// Note at some point we will simply merge the common and non-common Params into a single Param for simplicity
	
	
	// Load simulation settings
	Settings=WorkerData.Common.Settings;
	
	SimID = WorkerData.SimID; // this value is used to select the appropriate parameter value

	var ThreadID = WorkerData.ThreadID;// this value can be used by the code to send specific messages to particular elements, e.g. progress bar 4 set to 60%
	
	var StringForStatus="thread: "+ThreadID+" simID: "+SimID;
	self.postMessage({StatusText: StringForStatus, StatusTextID: ThreadID});
	
	// Load up mortality data
	MaleMortality=new MortalityCalculator(Data.Mortality.Male[1].Rates, Data.Mortality.Male[1].Year, Data.Mortality.Male[2].Rates, Data.Mortality.Male[2].Year);
	FemaleMortality=new MortalityCalculator(Data.Mortality.Female[1].Rates, Data.Mortality.Female[1].Year, Data.Mortality.Female[2].Rates, Data.Mortality.Female[2].Year);
	
	
	// Adjust data according to beliefs about inaccuracies 
	AdjustData();
	
	
	
	
	// Perform an optimisation of the number of injectors
	if (true){
		// Get the data for the numbers by sex and age
		var PWIDEntryOptimisationResults=OptimiseInjectionEntry(Data.PWID); 

	}

	
	
	
	var GenotypeValue=1;


	
	
	DebugStatement("Starting to load Person object");
	
	PPNotification=AssignPopulation(Data, Settings.SampleFactor);
	// For each person in the simulation 
	// Determine a random time that they have been infected for (lognormally distributed about 5 years previously, SD 2.5 years)
	

	
	var TimerFinish = new Date().getTime() / 1000;
    var TotalTime=TimerFinish -TimerStart;
	DebugStatement("Memory allocation stopped after "+TotalTime+" seconds");
	
	DebugStatement("Starting to HCV progression");
	
	var YearOfInfection;
	var YearOfDiagnosis;
	
	var ProgressDisplay=Math.round(PPNotification.length/100);//used to deliver progress rates back to the progress bar
	for (var i=0; i<PPNotification.length; i++){
		
		//TimeUntilDiagnosis=NormalRand(5, 2.5);//this may end up being lognormal
		TimeUntilDiagnosis=TimeUntilEvent(0.10);//this may end up being lognormal
		
		if (TimeUntilDiagnosis<0){TimeUntilDiagnosis=0}//correct 
		
		YearOfDiagnosisVector=PPNotification[i].HCV.Diagnosed.TimeOf(1);//Returns when "Diagnosed==1"
		YearOfDiagnosis=YearOfDiagnosisVector[0];
		YearOfInfection=YearOfDiagnosis-TimeUntilDiagnosis;// Zero is the first year of diagnosis
		
		PPNotification[i].HCV.Infection(YearOfInfection, GenotypeValue );//In future iterations, HCVParam will become Param.HCV
		if (i%ProgressDisplay==0){
			self.postMessage({ProgressBarValue: i/PPNotification.length});
		}

		PPNotification[i].CalculateGeneralMortality(YearOfDiagnosis); // Calculate date of mortality from the date of diagnosis
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
	}
	if (false){
		
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
	var IntCount=0;
	SimResult.Intervention=[];
	SimResult.Intervention[IntCount]=[];
	SimResult.Intervention[IntCount][0]=FibrosisCount(PPNotification, Settings.SampleFactor, StatsTime);//Determine fibrosis levels with year
	SimResult.Intervention[IntCount][1]=LivingDxAndUDx(PPNotification, Settings.SampleFactor, StatsTime);//Determine fibrosis levels with year
	SimResult.Intervention[IntCount][2]=AgeInfected(PPNotification, StatsTime);
	SimResult.Intervention[IntCount][3]=LivingWithHCV(PPNotification, Settings.SampleFactor, StatsTime);// Determines a simple count of people living with HCV by year

	DebugStatement("Total individuals in model: " + PPNotification.length);
		
	TimerFinish = new Date().getTime() / 1000;
    TotalTime=TimerFinish -TimerStart;
	DebugStatement("Finished full simulation in "+TotalTime+" seconds");
	

	
	SimResult.OriginalData=PWIDEntryOptimisationResults;
	
	
	// The new structure of the the program is:
	// Optimise without intervention
	// Optimise with intervention (with [0] being with no interventions)
	// for each intervention {
	//      FullSimulation(Intervention[num])
	//		SimResult.Intervention[0].Result=ExtractResults
	//		Intervention[num]this.ResetFunction
	// }
	// Do comparison of interventions if we feel it is necessary
	
	
	
	// SimResult should be structured as follows
	// SimResult.OptimisedValues // if they were previously optimised, they should stay that way
	// SimResult.Intervention[0] // the baseline result. 
	// SimResult.Intervention[1] // the first intervention result. Should contain 
	// SimResult.Intervention[1].Instructions 
	// SimResult.Intervention[1].Instructions[0].Type // Instantaneous or Gradual parameter change
	// SimResult.Intervention[1].Instructions[0].Start // the year that the intervention takes place
	// SimResult.Intervention[1].Instructions[0].BuildUp // the duration of gradual build up
	// SimResult.Intervention[1].Instructions[0].Stop // the year intervention ends
	// SimResult.Intervention[1].Instructions[0].ParameterName // the parameter to be adjusted
	// SimResult.Intervention[1].Instructions[0].CodeText // to be run each year to adjust parameters e.g. 
	// 				TempFunction=function(Year){
	//					if (Year>2016){
	//						Parameter.HCV.Treatment.SofosbuvirLateStage=0.2;
	// 					}
	// 
	// eval("FunctionToRun=function(Data){"+e.data.Execute.Code+"};");
	// SimResult.Intervention[1].Results 
	
	
	
	return SimResult;

};

function AdjustData(){
	AdjustPWID();//(Data, AdjustmentFactor);
}

function AdjustPWID(){//Data, AdjustmentFactor){// This should occur prior to passing the data to the function
	// FunctionInput.EntryParams.AIHWHouseholdSurveryUncertaintySD=0.1;// a value that gives variation in the result due to the small numbers
		
	// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimate=1.2;
	// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateLowerRange=1.0;
	// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateUpperRange=1.4;
	AdjustmentFactor=Param.IDU.AIHWDataFactor;
	
	console.error("The adjustment is" +AdjustmentFactor);
	
	

	Data.PWID.Ever.Male=Multiply(Data.PWID.Ever.Male, AdjustmentFactor);
	Data.PWID.Ever.Female=Multiply(Data.PWID.Ever.Female, AdjustmentFactor);
	Data.PWID.Recent.Male=Multiply(Data.PWID.Recent.Male, AdjustmentFactor);
	Data.PWID.Recent.Female=Multiply(Data.PWID.Recent.Female, AdjustmentFactor);
}

function CollectStatistic(){
// the purpose of this function is to ask the global variables for results on the fly from the interface

}


function TestMulticoreSim(WorkerMessage){
	// RunSettings2={};
	// RunSettings2.FunctionName="TestMulticoreSim";
	// SimulationHolder.Run(RunSettings2);
	
	var StatsTime={};
	StatsTime.Start=1980;
	StatsTime.Stop=2030;
	StatsTime.Step=1;

	var SummaryStatResults=AgeInfected(PPNotification, StatsTime);
	return SummaryStatResults;
}



