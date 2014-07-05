importScripts("simulation.js");
importScripts("person.js");
importScripts("HCV.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	ReturnMessage=WhatsGiven.a+SimNumber;
	
    self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
