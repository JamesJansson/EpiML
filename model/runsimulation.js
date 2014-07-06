importScripts("simulation.js");
importScripts("person.js");
importScripts("hcv.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	ReturnMessage=WhatsGiven+SimNumber;
	
	var PP=[];
	for (i=0; i<5000000; i++)
	{
		PP[i]=new PersonObject(2, 1985.1);
	}
	
	
	var Rarray=[];
	for (var i=1; i<10000000; i++)
	{
		Rarray=TimeUntilEvent(0.3);
	}
	
	
    self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
