importScripts("simulation.js");
importScripts("simulationtools.js");
importScripts("person.js");
importScripts("hcv.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	
	
	var PP=[];
	for (i=0; i<5000000; i++)
	{
		PP[i]=new PersonObject(2, 1985.1);
	}
	
	var Rarray=[];
	TotalLoops=10000000;
    var seconds1 = new Date().getTime() / 1000;
	for (var i=1; i<TotalLoops; i++)
	{
		Rarray=TimeUntilEvent(0.3);
		if (i%10000==0)
			self.postMessage({ConsoleMessage: i});
		}
	}
	var seconds2 = new Date().getTime() / 1000;
    TotalTime=seconds2 -seconds1;
	CalcsPerSec=TotalLoops/TotalTime;
	
	ReturnMessage=WhatsGiven+SimNumber+" "+CalcsPerSec;
	
	
    //self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
