// This object allows the user to perform multiple calculations over multiple Threads
//

// Example usage:
// ScriptName="SimulationToRun.js"; 
// Common=[InfoBlock];//All sims will have access to this information
// SimSpecificDataArray=[67, 33, 99, 55, 88];//can be an array of any type (including other classes). Uses array length to determine the number of simulations to run.
// NoThreads=6;//The number of Threads you want the simulation to run over
// SimulationObject=new MultiThreadSim(ScriptName, Common, SimSpecificDataArray, NoThreads); // getting it ready
// SimulationObject.Start(); // Start the simulations running

// Sample set up of SimulationToRun.js
// ----------------------------------------------------------
// importScripts("usefulscripts1.js", "usefulscripts2.js");//Scripts your function needs to use (note; only scripts in the same folder can be used)
//
// self.onmessage = function (e) {
// 		var SimNumber = e.data.SimNumber;
// 		var SimData = e.data.SimData;
// 		var Common = e.data.Common;
//
//		...//Where you do the calculations
//		
//		Result.Value1=24;//Stores the results
//		Result.Value2=25;
//
//		self.postMessage({SimNumber: e.data.SimNumber, Result: Result});//All simulations should end with this line
//}

// To use transferable objects 
// http://stackoverflow.com/questions/16071211/using-transferable-objects-from-a-web-worker/16766758#16766758 
// http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast 

function MultiThreadSim(ScriptName, NoSims, NoThreads, TerminateOnFinish){
	
	this.ScriptName=ScriptName;
	this.NoThreads=NoThreads;
	this.Worker=[];//An array of workers
	this.NoSims=NoSims;
	
	this.FunctionToRun=[];// the function to be run inside the new webworker
	
	
	if(typeof(TerminateOnFinish)==='undefined'){
		this.TerminateOnFinish=false;//This flag is used to indicate that following the  return of a 'result', the simulation should terminate.
	}
	else{
		this.TerminateOnFinish=TerminateOnFinish;
	}
	this.WorkerTerminated=[];
	
	this.RunFunctionOnCompletion=false;
	this.FunctionToRunOnCompletion; // 
	
	// There are two types of variable that indicate if a simulation is currently running:
	// One is that there are currently sims doing calculations
	// The other is to indicate that the thread exists but is dormant
	this.CurrentlyRunning=false;
	this.ThreadsOpen=false;
	
	this.Complete=false;
	this.NoSimsCurrentlyRunning=0;
	this.ThreadInUse= new Array(NoThreads);
	for (var i = 0; i < this.ThreadInUse.length; ++i) { this.ThreadInUse[i] = false; }
	
	this.SimsStarted=0;
	this.SimsComplete=0;
	this.Result=[];
	
	this.UseSimProgressBar=false;
	this.SimProgressBarID="SimProgressBar";//To allow a progress bar to be installed into the page
	this.UseWithinSimProgressBar=false;
	this.WithinSimProgressBarID="WithinSimProgressBar";// to give a progress bar to each of the simulations as they are running

	this.StatusTextElementName="StatusTextElement";
}

MultiThreadSim.prototype.Start=function(Common, SimDataArray) {
	this.Common=Common;
	this.SimDataArray=SimDataArray;//an array of values or objects to be passed to the specified script
	
	//Check that nothing else is running
	if (this.CurrentlyRunning==true){
		console.log("Warning: this simulation has already been started. You may want to run .Terminate() ");
		return 0;
	};
	this.CurrentlyRunning=true;
	this.NoSimsCurrentlyRunning=0;
	this.Complete=false;
	
	// Set progress bar to zero
	if (this.UseSimProgressBar==true){
		document.getElementById(this.SimProgressBarID).value=0;
	}
	
	// Set up the 'WorkerTerminated' array
	for (var i=0; i<this.NoSims; i++){
		this.WorkerTerminated[i]=false;
	}
	
	//Create workers	
	this.StartNextSim();
};

MultiThreadSim.prototype.StartNextSim=function() {

	var MoreSimsToRun=true;//flag to prevent continually trying to run more sims
	while (this.NoSimsCurrentlyRunning<this.NoThreads &&  MoreSimsToRun==true){//there are spare Threads available
		if (this.SimsStarted<this.NoSims){//if there are sims that have yet to be started
			// Find a free thread
			var ThreadCount=0;
			while (this.ThreadInUse[ThreadCount]==true){
				ThreadCount++;
			}
			this.ThreadInUse[ThreadCount]=true;
			var ThreadID=ThreadCount;
			
			var SimID=this.SimsStarted++;//run this sim, increment by 1
			this.NoSimsCurrentlyRunning++;//indicate that another Thread has become used
			
			this.Worker[SimID]= new Worker(this.ScriptName);
			
			var BoundMessage=MultiThreadSimMessageHandler.bind(this);
			this.Worker[SimID].onmessage = BoundMessage;
			this.Worker[SimID].ThreadID=ThreadID;
			
			//Post message will soon become a handler for many commands, including starting the simulation, optimising the simulation, and requesting data
			this.Worker[SimID].postMessage({ SimID: SimID, ThreadID: ThreadID, Common: this.Common, SimData: this.SimDataArray[SimID]});
		}
		else{ //there are no more sims to run
			MoreSimsToRun=false;
		}
		
	}
	
	//Determine if this is the last sim to complete
	if (this.SimsComplete>=this.NoSims){
		this.Complete=true;
		
		//this.Terminate();//close all the workers
		if (this.RunFunctionOnCompletion== true){
			this.FunctionToRunOnCompletion(this);
		}
	}
}


MultiThreadSim.prototype.Run=function(FunctionName, Common, SimDataArray, TerminateOnFinish) {
	this.FunctionToRun=FunctionName;

	//Check that nothing else is running
	if (this.CurrentlyRunning==true){
		console.log("Warning: a simulation has already been started. You may want to run .Terminate() ");
		return 0;
	};
	this.CurrentlyRunning=true;
	this.NoSimsCurrentlyRunning=0;
	this.Complete=false;
	
	
	
	
	
	this.Common=Common;
	this.SimDataArray=SimDataArray;//an array of values or objects to be passed to the specified script
	
	
	
	
	
	// Determine if the simulation is running or not 
	
	
	if (typeof(TerminateOnFinish)!='undefine'){
		this.TerminateOnFinish=TerminateOnFinish;
	}
	
	
	
	
	// Set progress bar to zero
	if (this.UseSimProgressBar==true){
		document.getElementById(this.SimProgressBarID).value=0;
	}
	
	// Set up the 'WorkerTerminated' array
	for (var i=0; i<this.NoSims; i++){
		this.WorkerTerminated[i]=false;
	}
	
	//Create workers	
	this.StartNextSim2();
};


MultiThreadSim.prototype.StartNextSim2=function() {

	var MoreSimsToRun=true;//flag to prevent continually trying to run more sims
	while (this.NoSimsCurrentlyRunning<this.NoThreads &&  MoreSimsToRun==true){//there are spare Threads available
		if (this.SimsStarted<this.NoSims){//if there are sims that have yet to be started
			// Find a free thread
			var ThreadCount=0;
			while (this.ThreadInUse[ThreadCount]==true){
				ThreadCount++;
			}
			this.ThreadInUse[ThreadCount]=true;
			var ThreadID=ThreadCount;
			
			var SimID=this.SimsStarted++;//run this sim, increment by 1
			this.NoSimsCurrentlyRunning++;//indicate that another Thread has become used
			
			this.Worker[SimID]= new Worker(this.ScriptName);
			
			var BoundMessage=MultiThreadSimMessageHandler.bind(this);
			this.Worker[SimID].onmessage = BoundMessage;
			this.Worker[SimID].ThreadID=ThreadID;
			
			//Post message will soon become a handler for many commands, including starting the simulation, optimising the simulation, and requesting data
			this.Worker[SimID].postMessage({ SimID: SimID, ThreadID: ThreadID, Common: this.Common, SimData: this.SimDataArray[SimID]});
		}
		else{ //there are no more sims to run
			MoreSimsToRun=false;
		}
		
	}
	
	//Determine if this is the last sim to complete
	if (this.SimsComplete>=this.NoSims){
		this.Complete=true;
		
		//this.Terminate();//close all the workers
		if (this.RunFunctionOnCompletion== true){
			this.FunctionToRunOnCompletion(this);
		}
	}
}







MultiThreadSimMessageHandler=function(e) {
	// There are 4 main message types that are handled
	// Messages to the StatusText (to be put somewhere on screen to indicate what is currently occurring)
	// Messages to the ProgressBar
	// Message to return result/indicate completeness
	// Receiving data from the Sim after a data request
	
	// Messages to the StatusText
	if (typeof e.data.StatusText != 'undefined'){
		// Example usage: self.postMessage({StatusText: "hello", StatusTextID: 2});// two identifies that is using thread 2's display text
		document.getElementById(this.StatusTextElementName+e.data.StatusTextID).value=e.data.StatusText;
	}
	if (typeof e.data.Console != 'undefined'){//used to pass structured data to the console
		console.log(e.data.Console);
	}
	// Messages to the ProgressBar
	if (typeof e.data.ProgressBarValue != 'undefined'){
		if (this.UseWithinSimProgressBar==true){
			document.getElementById(this.WithinSimProgressBarID+this.ThreadID).value=e.data.ProgressBarValue;
		}
	}
	
	// Allow the function to run an arbitrary function
	if (typeof e.data.Execute != 'undefined'){
		var FunctionToRun;
		eval("FunctionToRun=function(Data){"+e.data.Execute.Code+"};");
		FunctionToRun(e.data.Execute.Data);
		
		//Example usage:
		//SaySomething={};
		//SaySomething.Data="This is data";//NOte that Data can be an object, So there may be Data.Colour Data.Temperature
		//SaySomething.Code="console.log(Data);";
		//self.postMessage({Execute: SaySomething});
	}
	
	
	// Collect up results from this simulation, try to run next simulation
	if (typeof e.data.Result != 'undefined'){
		this.NoSimsCurrentlyRunning--;
		var SimID=e.data.WorkerMessage.SimID;
		this.Result[SimID]=e.data.Result;//Store the results of the simulation
		this.SimsComplete++;
		var ThreadID=e.data.WorkerMessage.ThreadID;
		this.ThreadInUse[ThreadID]=false;
		
		if (this.TerminateOnFinish){
			this.Worker[SimID].terminate();
			this.WorkerTerminated[SimID]=true;
		}
		
		this.StartNextSim();//Try to run more sims
		
		//Update the progress bar about completion
		if (this.UseSimProgressBar==true){
			document.getElementById(this.SimProgressBarID).value=this.SimsComplete/this.NoSims;
		}
	}
};

MultiThreadSim.prototype.Terminate=function() {//close down all workers
	for (SimID=0; SimID<this.NoSims; SimID++){
		this.Worker[SimID].terminate();
		this.WorkerTerminated[SimID]=true;
	}	
	this.CurrentlyRunning==false;
};



