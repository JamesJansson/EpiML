importScripts("requiredscripts.js"); // should include in it any function that could be called by multhreadsim

var MultithreadSimController;


self.onmessage = function (WorkerMessage) {
	var FunctionHolder;
	console.log(WorkerMessage);
	
	MultithreadSimController=new MultithreadSimControllerObject(WorkerMessage);
	
	eval("FunctionHolder="+WorkerMessage.data.FunctionToRun+";");
	var SimResult=FunctionHolder(WorkerMessage.data);
	self.postMessage({WorkerMessage: WorkerMessage.data, Result: SimResult});//All simulation will end with this line
}



function EvalText(data){
	var ReturnResult={};
	eval(data.Common);
	return ReturnResult;
}

// Create a holder that allows the simulations to draw on some of the higher level aspects of the multithreadsim
function MultithreadSimControllerObject(WorkerMessage){
	this.WorkerMessage=WorkerMessage;
}

MultithreadSimControllerObject.prototype.ThreadStatusText=function(StringForStatus){
	self.postMessage({StatusText: StringForStatus, StatusTextID: this.WorkerMessage.data.ThreadID});
}

MultithreadSimControllerObject.prototype.SetThreadStatusToSimNumber=function(){
	var StringForStatus="thread: "+this.WorkerMessage.data.ThreadID+" simID: "+this.WorkerMessage.data.SimID;
	this.ThreadStatusText(StringForStatus);
}