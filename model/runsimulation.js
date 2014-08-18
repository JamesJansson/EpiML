//Specify files to be included in the simulation
importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("mathtools.js");
importScripts("person.js");
importScripts("hcv.js");
importScripts("hiv.js");




var Param={};
var PP=[];
self.onmessage = function (e) {
	//In this section will be a message handler that allows calls
	// Initialise (set data and parameters)
	// Optimise (find unknown parameters)
	// Initialise with optimised data
	// Extrapolate (with current settings)
	// Intervention (with changed settings)
	// Get data
	// Save


	
	Rand.SetSeed();//note that this is an extremely important step to allow random numbers to be generated
	
	
	var seconds1 = new Date().getTime() / 1000;
	
	//Load the notification data
	
	
	
	
	var SimNumber = e.data.SimNumber;
    var SimData = e.data.SimData;//creates a pointer
	
	IncrementSize=Math.round(SimData.NoPeople/100);//used to deliver progress rates back to the progress bar
	
	Year=2014.5;
	GenotypeValue=0;
	YearOfBirth=1985.1;
	Age=29;
	Sex=1;
	Alcohol=0;
	YearsToSimulate=40;
	
	HCVParam={};
	HCVParam.F0F1=0.117;
	HCVParam.F1F2=0.085;
	HCVParam.F2F3=0.12;
	HCVParam.F3F4=0.116;
	HCVParam.F4LF=0.0001;//not real
	HCVParam.F4HCC=0.4;//not real


	console.log("Starting to load Person object");
	
	
	for (i=0; i<SimData.NoPeople; i++){
		PP[i]=new PersonObject(YearOfBirth, Sex);
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
	}
	
	var seconds2 = new Date().getTime() / 1000;
    TotalTime=seconds2 -seconds1;
	console.log("Memory allocation stopped after "+TotalTime+" seconds");
	
	console.log("Starting to HCV progression");
	
	for (i=0; i<SimData.NoPeople; i++){
		PP[i].HCV.Infection(Year, GenotypeValue, Age, Sex, Alcohol, HCVParam );
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
	}
	
	//Determine fibrosis levels with year

	
	FibrosisMatrix=new ZeroMatrix(6, YearsToSimulate+1);
	
	console.log("Extracting results");
	YearCount=0;
	for (GraphYear=Year; GraphYear<Year+YearsToSimulate+1; GraphYear++){
		for (i=0; i<SimData.NoPeople; i++){
			FibrosisLevel=PP[i].HCV.Fibrosis.Get(GraphYear).Value;
			//self.postMessage({ConsoleMessage: "FibrosisLevel "+ FibrosisLevel+ " YearCount" + YearCount});
			FibrosisMatrix[FibrosisLevel][YearCount]=FibrosisMatrix[FibrosisLevel][YearCount]+1;;
		}
		YearCount++;
		self.postMessage({ProgressBarValue: (YearCount/(YearsToSimulate+1))});
	}
	
	seconds2 = new Date().getTime() / 1000;
    TotalTime=seconds2 -seconds1;

	console.log("Finished simulation in "+TotalTime+" seconds");
	var SimResult={};
	SimResult.HCVTestResult=FibrosisMatrix;
	
	//Saving simulation results into local storage

	
	self.postMessage({SimNumber: e.data.SimNumber, Result: SimResult});//All simulation will end with this line
};
