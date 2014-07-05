importScripts("model/simulation.js");
importScripts("model/person.js");
importScripts("model/HCV.js");

self.onmessage = function (e) {
    var SimNumber = e.data.SimNumber;
    var WhatsGiven = e.data.SimData;
	


	ReturnMessage=WhatsGiven.a+SimNumber;
	
    self.postMessage({SimNumber: SimNumber, result: ReturnMessage });
};
