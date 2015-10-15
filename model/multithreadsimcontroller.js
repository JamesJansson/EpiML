// Determine if running under node or a webworker
if (typeof exports === 'undefined'){
	var RunningNode = true;
	} 
else {
	var RunningNode = false;
}


if (RunningNode==false){
	importScripts("main.js"); // should include in it any function that could be called by multhreadsim
	var MultithreadSimController;
	self.onmessage = function (WorkerMessage) {
		var FunctionHolder;
		
		MultithreadSimController=new MultithreadSimControllerObject(WorkerMessage);// this line should actually become global, possibly
		
		console.log(WorkerMessage.data.FunctionToRun);
		
		if (typeof(WorkerMessage.data.AddMessageFunction)!='undefined'){
			for (var MCount in WorkerMessage.data.AddMessageFunction){
				// Generate a function that the program can use to send back information
				var evalText=WorkerMessage.data.AddMessageFunction[MCount];
				evalText+="=function(DataToSendBack){";
				evalText+="var StructSendBack={};";
				evalText+="StructSendBack.MessageFunctionName='"+WorkerMessage.data.AddMessageFunction[MCount]+"';";
				evalText+="StructSendBack.Data=DataToSendBack;";
				evalText+="self.postMessage(StructSendBack);}";
	
				eval(evalText);
			}
		}
		else{
			console.error("did not find any functions");	
		}
		eval("FunctionHolder="+WorkerMessage.data.FunctionToRun+";");
		var SimResult=FunctionHolder(WorkerMessage.data);
		var ResultWithFunctionsRemoved=MTSDeepCopyData(SimResult);//functions crash the thread if passed back to the main thread
		self.postMessage({WorkerMessage: WorkerMessage.data, Result: ResultWithFunctionsRemoved});//All simulation will end with this line
	};
}
else{// is running under node
	// Set up required node modules
	// Allow importScripts to be used
	importScripts=require('./importScripts.js').importScripts;
	// make the console behave in the nw.js interface in a similar way to how it behaves with webworkers
	require('./nwjsnode.js').ConsoleSetup();
	
	process.on('message', function (MessageString) {
		var Message=JSON.parse(MessageString);
		
		console.log(Message);
		
		//if (Message.Instruction=='RunFunction'){}
		
		
		console.error('Received data: ' + MessageString);
		
		console.log('Received data log: ' + MessageString);
		
		console.log([12, 3, 5]);
		
		process.send(MessageString.toUpperCase());
		
	});
	
	
}






// ---------------------------------------------------------------------------------
// Running a function
// RunSettings2={};
// RunSettings2.FunctionName="RunFullModel";
// RunSettings2.Common={};
// RunSettings2.Common.HCVTretmentFunctionID=Settings.HCVTreatmentScenario;
// RunSettings2.SimDataArray=[1, 2, 3];
// SimulationHolder.Run(RunSettings2);






// ---------------------------------------------------------------------------------
// Running arbitrary text

function EvalText(data){
	var ReturnResult={};
	eval(data.Common);
	return ReturnResult;
}

// RunSettings2={};
// RunSettings2.FunctionName="EvalText";
// RunSettings2.Common="BBB=new RegularInjectionTimeObject;console.log(BBB.Time());";
// SimulationHolder.Run(RunSettings2);
// ---------------------------------------------------------------------------------


// Create a holder that allows the simulations to draw on some of the higher level aspects of the multithreadsim
function MultithreadSimControllerObject(WorkerMessage){
	this.WorkerMessage=WorkerMessage;
}

MultithreadSimControllerObject.prototype.ThreadStatusText=function(StringForStatus){
	self.postMessage({StatusText: StringForStatus, StatusTextID: this.WorkerMessage.data.ThreadID});
};

MultithreadSimControllerObject.prototype.SetThreadStatusToSimNumber=function(){
	var StringForStatus="thread: "+this.WorkerMessage.data.ThreadID+" simID: "+this.WorkerMessage.data.SimID;
	this.ThreadStatusText(StringForStatus);
};

MultithreadSimControllerObject.prototype.ThreadID=function(){
	return this.WorkerMessage.data.ThreadID;
};


MultithreadSimControllerObject.prototype.SimID=function(){
	return this.WorkerMessage.data.SimID;
};






// Inspired by
// http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/

function MTSDeepCopyData(obj) {// copies non-function data only
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
	if (obj===null){// special case for null which thinks it is an object
		return obj;
	}
    if (typeof obj === 'object') {
        var out = {};
        for (var i in obj ) {
            if (typeof obj[i] !== 'function') {
            out[i] = arguments.callee(obj[i]);
            }
        }
        return out;
    }
    return obj;
}
