// Determine if running under node or a webworker
if (typeof exports === 'undefined'){
	var MultithreadSimControllerRunningNode = false;
	} 
else {
	var MultithreadSimControllerRunningNode = true;
}

var MultithreadSimController=NaN;

if (MultithreadSimControllerRunningNode==false){
	importScripts("main.js"); // should include in it any function that could be called by multhreadsim
	
	self.onmessage = function (WorkerMessage) {
		var MTSMessage=WorkerMessage.data;
		var FunctionHolder;
		
		console.log(WorkerMessage);
		throw "stopping";
		
		MultithreadSimController=new MultithreadSimControllerObject(MTSMessage);// this line should actually become global, possibly
		
		console.log(MTSMessage.FunctionToRun);
		
		if (typeof(MTSMessage.AddMessageFunction)!='undefined'){
			for (var MCount in MTSMessage.AddMessageFunction){
				// Generate a function that the program can use to send back information
				var evalText=MTSMessage.AddMessageFunction[MCount];
				evalText+="=function(DataToSendBack){";
				evalText+="var StructSendBack={};";
				evalText+="StructSendBack.MessageFunctionName='"+MTSMessage.AddMessageFunction[MCount]+"';";
				evalText+="StructSendBack.Data=DataToSendBack;";
				evalText+="StructSendBack.SimID="+MultithreadSimController.SimID()+";";
				evalText+="self.postMessage(StructSendBack);}";
	
				eval(evalText);
			}
		}
		else{
			console.error("did not find any functions");	
		}
		
		eval("FunctionHolder="+MTSMessage.FunctionToRun+";");
		var SimResult=FunctionHolder(MTSMessage);
		var ResultWithFunctionsRemoved=MTSDeepCopyData(SimResult);//functions crash the thread if passed back to the main thread
		var DataToSendBack={MTSMessage: MTSMessage, Result: ResultWithFunctionsRemoved};
		self.postMessage(DataToSendBack);
		};
}
else{// is running under node.js
	// Set up required node modules
	// Allow importScripts to be used
	importScripts=require('importScripts').importScripts;
	// make the console behave in the nw.js interface in a similar way to how it behaves with webworkers
	require('nwjsnode').ConsoleSetup();
	importScripts("main.js"); // should include in it any function that could be called by multhreadsim
	
	
	process.on('message', function (WorkerMessage) {
		var MTSMessage=WorkerMessage;
		var FunctionHolder;
		
		// console.log(WorkerMessage);
		// throw "stopping";
		
		
		MultithreadSimController=new MultithreadSimControllerObject(MTSMessage);// this line should actually become global, possibly
		
		console.log(MTSMessage.FunctionToRun);
		
		if (typeof(MTSMessage.AddMessageFunction)!='undefined'){
			for (var MCount in MTSMessage.AddMessageFunction){
				// Generate a function that the program can use to send back information
				var evalText=MTSMessage.AddMessageFunction[MCount];
				evalText+="=function(DataToSendBack){";
				evalText+="var StructSendBack={};";
				evalText+="StructSendBack.MessageFunctionName='"+MTSMessage.AddMessageFunction[MCount]+"';";
				evalText+="StructSendBack.Data=DataToSendBack;";
				evalText+="StructSendBack.SimID="+MultithreadSimController.SimID()+";";
				evalText+="StructSendBack.MTSMessage=MTSMessage;";
				evalText+="process.send(StructSendBack);}";
	
				eval(evalText);
			}
		}
		else{
			console.error("did not find any functions");	
		}
		
		eval("FunctionHolder="+MTSMessage.FunctionToRun+";");
		var SimResult=FunctionHolder(MTSMessage);
		var ResultWithFunctionsStringified=MTSDeepCopyData(SimResult);//functions crash the thread if passed back to the main thread
		var DataToSendBack={MTSMessage: MTSMessage, Result: ResultWithFunctionsStringified};
		return process.send(DataToSendBack);
		
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
function MultithreadSimControllerObject(MTSMessage){
	this.MTSMessage=MTSMessage;
}

MultithreadSimControllerObject.prototype.ThreadStatusText=function(StringForStatus){
	var ObjectToSend={StatusText: StringForStatus, StatusTextID: this.MTSMessage.ThreadID};
	if (MultithreadSimControllerRunningNode){
		process.send(ObjectToSend);
	}
	else { // running in a webworker
		self.postMessage(ObjectToSend);
	}
};

MultithreadSimControllerObject.prototype.SetThreadStatusToSimNumber=function(){
	var StringForStatus="thread: "+this.MTSMessage.ThreadID+" simID: "+this.MTSMessage.SimID;
	this.ThreadStatusText(StringForStatus);
};

MultithreadSimControllerObject.prototype.ThreadID=function(){
	return this.MTSMessage.ThreadID;
};


MultithreadSimControllerObject.prototype.SimID=function(){
	return this.MTSMessage.SimID;
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
