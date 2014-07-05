importScripts("simulation.js");
importScripts("person.js");
importScripts("hcv.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	ReturnMessage=WhatsGivenSimNumber;
	
    self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
