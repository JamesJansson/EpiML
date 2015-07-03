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

var ShowDebugStatements=true;
function DebugStatement(ConsoleMessage){
	if (ShowDebugStatements){
		console.log(ConsoleMessage);
	}
}


function SimSetup(WorkerData){
	// The purpose of this function is to create globals that will persis over multiple simulations
	
	//In this section will be a message handler that allows calls
	// Initialise (set data and parameters)
	
	
	DebugStatement("Data passed to the simulation");
	DebugStatement(WorkerData);//This passes the data back to the console so we can look at it
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated

	
	//Load the notification data
	Data=WorkerData.Common.Data;
	//Load the parameters data
	Param = WorkerData.SimData;
	// Load the settings
	Settings=WorkerData.Common.Settings;
	
	MultithreadSimController.SetThreadStatusToSimNumber();
	
	
	// Load up mortality data
	MaleMortality=new MortalityCalculator(Data.Mortality.Male[1].Rates, Data.Mortality.Male[1].Year, Data.Mortality.Male[2].Rates, Data.Mortality.Male[2].Year);
	FemaleMortality=new MortalityCalculator(Data.Mortality.Female[1].Rates, Data.Mortality.Female[1].Year, Data.Mortality.Female[2].Rates, Data.Mortality.Female[2].Year);
	
	// Play around with the notifications structure
	
	
	
	// Adjust data according to beliefs about inaccuracies 
	AdjustDataForKnownBiases();
	
	return 0;
}


function AdjustDataForKnownBiases(){
	AdjustPWIDUnderReporting();//(Data, AdjustmentFactor);
}

function AdjustPWIDUnderReporting(){//Data, AdjustmentFactor){// This should occur prior to passing the data to the function
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





