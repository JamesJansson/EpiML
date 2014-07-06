importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("person.js");
importScripts("hcv.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var SimData = e.data.SimData;
	
	IncrementSize=Math.round(SimData.NoPeople/100);
	
	
	Year=2014.5;
	GenotypeValue=0;
	Age=29;
	Sex=1;
	Alcohol=0;
	
	HCVParam={};
	HCVParam.F0F1=0.2;
	HCVParam.F1F2=0.1;
	HCVParam.F2F3=0.15;
	HCVParam.F3F4=0.3;
	HCVParam.F4LF=0.5;
	HCVParam.F4HCC=0.4;


	self.postMessage({ConsoleMessage: "Starting to load Person object"});
	
	var PP=[];
	for (i=0; i<SimData.NoPeople; i++){
		PP.push(new PersonObject(2, 1985.1));
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
	}
	
	self.postMessage({ConsoleMessage: "Starting to HCV progression"});
	
	for (i=0; i<SimData.NoPeople; i++){
		PP[i].HCV.Infection(Year, GenotypeValue, Age, Sex, Alcohol, HCVParam );
		if (i%IncrementSize==0){
			self.postMessage({ProgressBarValue: i/SimData.NoPeople});
		}
	}
	
	//Determine fibrosis levels with year

	
	FibrosisMatrix=ZeroMatrix(6, 100);
	
	self.postMessage({ConsoleMessage: "Starting to HCV progression"});
	YearCount=0;
	for (GraphYear=Year-1; GraphYear<Year+40; GraphYear++){
		for (i=0; i<SimData.NoPeople; i++){
			FibrosisLevel=PP[i].HCV.Fibrosis.Get(GraphYear).Value;
			//self.postMessage({ConsoleMessage: "FibrosisLevel "+ FibrosisLevel+ " YearCount" + YearCount});
			FibrosisMatrix[FibrosisLevel][YearCount]++;
		}
		YearCount++;
		self.postMessage({ConsoleMessage: "FibrosisLevel "+ FibrosisLevel+ " YearCount" + YearCount});
	}
	
	
	
	
	
	
	
	
	self.postMessage({ConsoleMessage: "Starting to run time until diagnosis"});
	
	
	var Rarray=[];
	TotalLoops=10000000;
    var seconds1 = new Date().getTime() / 1000;
	for (var i=1; i<TotalLoops; i++){
		Rarray=TimeUntilEvent(0.3);
		if (i%10000==0){
			self.postMessage({ProgressBarValue: i/TotalLoops});
		}
	}
	var seconds2 = new Date().getTime() / 1000;
    TotalTime=seconds2 -seconds1;
	CalcsPerSec=TotalLoops/TotalTime;
	
	ReturnMessage=WhatsGiven+SimNumber+" "+CalcsPerSec;
	
	self.postMessage({ConsoleMessage: "Finished simulation"});
};
