importScripts("requiredscripts.js"); // should include in it any function that could be called by multhreadsim

self.onmessage = function (WorkerMessage) {
	var FunctionHolder;
	eval("FunctionHolder="+WorkerMessage.FunctionToRun+";");
	var SimResult=FunctionHolder(WorkerMessage.Args);
	self.postMessage({WorkerMessage: WorkerMessage.data, Result: SimResult});//All simulation will end with this line
}