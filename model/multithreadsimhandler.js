importScripts("requiredscripts.js"); // should include in it any function that could be called by multhreadsim

self.onmessage = function (WorkerMessage) {
	var FunctionHolder;
	console.log(WorkerMessage);
	
	eval("FunctionHolder="+WorkerMessage.data.FunctionToRun+";");
	var SimResult=FunctionHolder(WorkerMessage.data);
	self.postMessage({WorkerMessage: WorkerMessage.data, Result: SimResult});//All simulation will end with this line
}