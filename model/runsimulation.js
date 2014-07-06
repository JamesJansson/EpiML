importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("person.js");
importScripts("hcv.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	self.postMessage({ConsoleMessage: "Starting to load Person object"});
	
	var PP=[];
	for (i=0; i<300000; i++){
		PP.push(new PersonObject(2, 1985.1));
		if (i%10000==0){
			self.postMessage({ConsoleMessage: i+" of 300000"});
		}
	}
	
	self.postMessage({ConsoleMessage: "Starting to run time until diagnosis"});
	
	
	var Rarray=[];
	TotalLoops=10000000;
    var seconds1 = new Date().getTime() / 1000;
	for (var i=1; i<TotalLoops; i++){
		Rarray=TimeUntilEvent(0.3);
		if (i%10000==0){
			self.postMessage({ConsoleMessage: i});
		}
	}
	var seconds2 = new Date().getTime() / 1000;
    TotalTime=seconds2 -seconds1;
	CalcsPerSec=TotalLoops/TotalTime;
	
	ReturnMessage=WhatsGiven+SimNumber+" "+CalcsPerSec;
	
	
    //self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
