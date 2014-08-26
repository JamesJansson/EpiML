//Specify files to be included in the simulation
importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("mathtools.js");
importScripts("person.js");
importScripts("hcv.js");
importScripts("hiv.js");
importScripts("assignpopulation.js");
//importScripts("standardsummarystats.js");


var Param={};//This is the parameter holder for the simulation
var PP=[];//This is the global array that holds the population
self.onmessage = function (e) {
	//In this section will be a message handler that allows calls
	// Initialise (set data and parameters)
	// Optimise (find unknown parameters)
	// Initialise with optimised data
	// Extrapolate (with current settings)
	// Intervention (with changed settings)
	// Get data
	// Save

	self.postMessage({Console: e.data});//This passes the data back to the console so we can look at it
	
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated
	
	
	var TimerStart = new Date().getTime() / 1000;
	
	//Load the notification data
	
	
	
	
	var SimID = e.data.SimNumber; // this value is used to select the appropriate parameter value
    var SimData = e.data.SimData;//creates a pointer
	
	var IncrementSize=Math.round(SimData.NoPeople/100);//used to deliver progress rates back to the progress bar
	
	var Year=2014.5;
	var GenotypeValue=0;
	var YearOfBirth=1985.1;
	var Age=29;
	var Sex=1;
	var Alcohol=0;
	var YearsToSimulate=40;
	
	var HCVParam={};
	HCVParam.F0F1=0.117;
	HCVParam.F1F2=0.085;
	HCVParam.F2F3=0.12;
	HCVParam.F3F4=0.116;
	HCVParam.F4LF=0.0001;//not real
	HCVParam.F4HCC=0.4;//not real


	console.log("Starting to load Person object");
	
	
	PPNotification=AssignPopulation(Data);
	// For each person in the simulation 
	// Determine a random time that they have been infected for (lognormally distributed about 5 years previously, SD 2.5 years)
	
	
	
	var TimerFinish = new Date().getTime() / 1000;
    var TotalTime=TimerFinish -TimerStart;
	console.log("Memory allocation stopped after "+TotalTime+" seconds");
	
	console.log("Starting to HCV progression");
	
	var YearOfInfection;
	for (var i=0; i<SimData.NoPeople; i++){
		 
		YearOfInfection=PPNotification[i].HCV.Infection
		
		PP[i].HCV.Infection(Year, GenotypeValue, Age, Sex, Alcohol, HCVParam );//In future iterations, HCVParam will become Param.HCV
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
	}
	
	//Determine fibrosis levels with year

	
	var FibrosisMatrix=new ZeroMatrix(6, YearsToSimulate+1);
	
	console.log("Extracting results");
	var YearCount=0;
	for (var GraphYear=Year; GraphYear<Year+YearsToSimulate+1; GraphYear++){
		for (var i=0; i<SimData.NoPeople; i++){
			FibrosisLevel=PP[i].HCV.Fibrosis.Get(GraphYear).Value;
			//self.postMessage({ConsoleMessage: "FibrosisLevel "+ FibrosisLevel+ " YearCount" + YearCount});
			FibrosisMatrix[FibrosisLevel][YearCount]=FibrosisMatrix[FibrosisLevel][YearCount]+1;;
		}
		YearCount++;
		self.postMessage({ProgressBarValue: (YearCount/(YearsToSimulate+1))});
	}
	
	var seconds2 = new Date().getTime() / 1000;
    var TotalTime=seconds2 -seconds1;

	console.log("Finished simulation in "+TotalTime+" seconds");
	var SimResult={};
	SimResult.HCVTestResult=FibrosisMatrix;
	
	//Saving simulation results into local storage

	
	self.postMessage({SimNumber: e.data.SimNumber, Result: SimResult});//All simulation will end with this line
};
