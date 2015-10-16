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

// function MultiThreadSim(ScriptName, NoSims, NoThreads, TerminateOnFinish){
	
	// this.ScriptName=ScriptName;
function MultiThreadSim(FolderName, NoSims, NoThreads, TerminateOnFinish){
	this.FolderName=FolderName;
	this.NoThreads=NoThreads;
	this.Worker=[];//An array of workers
	this.NoSims=NoSims;
	
	this.UseNode=true;// set to false to use webworker
	this.NodeArgs=[];
	this.NodeArgs.push("--expose-gc");
	this.NodeArgs.push("-max-old-space-size=6047");
	
	
	
	this.ScriptName="multithreadsimcontroller.js";
	
	
	console.log(this.ScriptName);
	
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
	this.NoThreadsCurrentlyRunning=0;
	this.NoThreadsOpen=0;
	this.ThreadInUse= new Array(NoThreads);
	for (var i = 0; i < this.ThreadInUse.length; ++i) { this.ThreadInUse[i] = false; }
	
	this.SimsStarted=0;
	this.SimsComplete=0;
	this.Result=[];
	
	this.AllWorkersStarted=false;
	
	
	this.UseSimProgressBar=false;
	this.SimProgressBarID="SimProgressBar";//To allow a progress bar to be installed into the page
	this.UseWithinSimProgressBar=false;
	this.WithinSimProgressBarID="WithinSimProgressBar";// to give a progress bar to each of the simulations as they are running

	this.StatusTextElementName="StatusTextElement";
	
	this.SimMessageFunctionArray=[];
	this.InterfaceMessageFunctionArray=[];
}

MultiThreadSim.prototype.AddMessageFunction=function(SimFunctionName, InterfaceFunctionPointer){
	//  When the function SimFunctionName is called in the sim, InterfaceFunctionPointer is run in the interface
	// function RepetitiveError(Data){for (var i=0; i<100; i++){console.error(Data+i)}}
	// SimulationHolder.AddMessageFunction("InSimFunction", RepetitiveError)
	// in the sim call
	// InSimFunction("This is the message");
	
	
	if (typeof(SimFunctionName)!="string"){
		throw "AddMessageFunction(SimFunctionName, InterfaceFunctionPointer), SimFunctionName is a string of the name of the function to run in the sim";
	}
	if (typeof(InterfaceFunctionPointer)!="function"){
		throw "AddMessageFunction(SimFunctionName, InterfaceFunctionPointer), InterfaceFunctionPointer is a pointer to the function in the interface to run";
	}
	
	this.SimMessageFunctionArray.push(SimFunctionName);
	this.InterfaceMessageFunctionArray.push(InterfaceFunctionPointer);	
}

MultiThreadSim.prototype.Run=function(RunSettings){//FunctionName, Common, SimDataArray, TerminateOnFinish) {
	//RunSettings has the following elements
	// RunSettings.FunctionName: Required. Runs that simulation 
	// RunSettings.Common: Optional. Passes this information to FunctionName(Input) as Input.Common
	// RunSettings.SimDataArray: Optional. An array the length of the number of sims. Passes this information to FunctionName(Input) as Input.SimData
	// RunSettings.TerminateOnFinish: Optional. Tells the worker to terminate to save memory or CPU use. 
	// RunSettings.FunctionToRunOnCompletion: Optional. Runs once all workers have finished.

	//Check that nothing else is running
	if (this.CurrentlyRunning==true){
		console.log("Warning: a simulation has already been started. You may want to run .Terminate() ");
		return 0;
	};

	
	// Import and check settings
	if (typeof(RunSettings.FunctionName)=='undefined'){
		throw "A RunSettings.FunctionName must be set when runnning MultiThreadSim.Run(RunSettings)";
	}
	this.FunctionToRun=RunSettings.FunctionName;

	if (typeof(RunSettings.Common)!='undefined'){
		this.Common=RunSettings.Common;
	}
	else{
		this.Common={};// Don't pass anything in the common holder
	}
	
	if (typeof(RunSettings.SimDataArray)!='undefined'){
		// Check that the data is the right size
		if (RunSettings.SimDataArray.length!=this.NoSims){
			throw "The size of the sim data array should be the same as the number of sims in the set up of MultiThreadSim";
		}
		this.SimDataArray=RunSettings.SimDataArray;//an array of values or objects to be passed to the specified script
	}
	else{
		this.SimDataArray = [];
		for (var i = 0; i < this.NoSims; i++)
			this.SimDataArray.push({});
	}
	
	// Terminate on finish is optional
	if (typeof(RunSettings.TerminateOnFinish)!='undefined'){
		this.TerminateOnFinish=RunSettings.TerminateOnFinish;
	}
	//else use the set up originally decided when the object was started

	if (typeof(RunSettings.FunctionToRunOnCompletion)!='undefined'){
		this.FunctionToRunOnCompletion=RunSettings.FunctionToRunOnCompletion;
		this.RunFunctionOnCompletion=true;
	}
	else{
		this.RunFunctionOnCompletion=false;
	}
	
	
	// Start up the run
	this.CurrentlyRunning=true;
	this.ThreadsOpen=true;// is false once all simulations are closed
	this.NoThreadsCurrentlyRunning=0;
	this.Complete=false;
	this.SimsComplete=0;
	this.SimsStarted=0;
	
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
	if (this.UseNode==true){
		var NWJSNodeChildProcess=require('nwjsnode').ChildProcess;
	}
	
	var MoreSimsToRun=true;//flag to prevent continually trying to run more sims
	while (this.NoThreadsCurrentlyRunning<this.NoThreads &&  MoreSimsToRun==true){//there are spare Threads available
		if (this.SimsStarted<this.NoSims){//if there are sims that have yet to be started
			// Find a free thread
			var ThreadCount=0;
			while (this.ThreadInUse[ThreadCount]==true){
				ThreadCount++;
			}
			this.ThreadInUse[ThreadCount]=true;
			var ThreadID=ThreadCount;
			
			var SimID=this.SimsStarted++;//run this sim, increment by 1
			this.NoThreadsCurrentlyRunning++;//indicate that another Thread has become used
			
			// the first time the simulation is run, we need to start up the workers
			if (this.AllWorkersStarted==false){
				this.NoThreadsOpen++;
				var BoundMessage=MultiThreadSimMessageHandler.bind(this);
				
				if (this.UseNode==true){
					var ChildProcessOptions={};
					ChildProcessOptions.cwd="./"+this.FolderName;// set the directory for where the model is
					var ScriptAndOtherArgs=[this.ScriptName];
					ScriptAndOtherArgs=ScriptAndOtherArgs.concat(this.NodeArgs);
					this.Worker[SimID]=new NWJSNodeChildProcess(ScriptAndOtherArgs, ChildProcessOptions);
				}
				else { // use webworker
					var ScriptPath=this.FolderName+"/"+this.ScriptName;
					this.Worker[SimID]= new Worker(ScriptPath);
				}
				this.Worker[SimID].onmessage = BoundMessage;
			}
			this.Worker[SimID].ThreadID=ThreadID;
			this.Worker[SimID].SimID=SimID;
			//Post message will soon become a handler for many commands, including starting the simulation, optimising the simulation, and requesting data
			var DataToSendToWorker={FunctionToRun: this.FunctionToRun, 
				SimID: SimID, 
				ThreadID: ThreadID, 
				Common: this.Common, 
				SimData: this.SimDataArray[SimID], 
				AddMessageFunction: this.SimMessageFunctionArray};
			
			// Send instructions to workers
			this.Worker[SimID].postMessage(DataToSendToWorker);
		}
		else{ //there are no more sims to run
			MoreSimsToRun=false;
		}
		
	}
	
	//Determine if this is the last sim to complete
	if (this.SimsComplete>=this.NoSims){
		this.Complete=true;
		
		this.CurrentlyRunning=false;
		
		
		if (this.TerminateOnFinish==true){
			this.ThreadsOpen=false;
		}
		else{
			this.AllWorkersStarted=true;
		}
		
		//this.Terminate();//close all the workers
		if (this.RunFunctionOnCompletion== true){
			this.FunctionToRunOnCompletion(this);
		}
	}
}

MultiThreadSim.prototype.Terminate=function() {//close down all workers
	for (var SimID=0; SimID<this.NoSims; SimID++){
		this.Worker[SimID].terminate();
		this.WorkerTerminated[SimID]=true;
	}
	this.ThreadsOpen=true;
	this.CurrentlyRunning==false;
};






MultiThreadSimMessageHandler=function(ReturnedMessage) {
	// There are 4 main message types that are handled
	// Messages to the StatusText (to be put somewhere on screen to indicate what is currently occurring)
	// Messages to the ProgressBar
	// Message to return result/indicate completeness
	// Receiving data from the Sim after a data request
	console.log(ReturnedMessage)
	// Messages to the StatusText
	if (typeof ReturnedMessagedata.StatusText != 'undefined'){
		// Example usage: self.postMessage({StatusText: "hello", StatusTextID: 2});// two identifies that is using thread 2's display text
		document.getElementById(this.StatusTextElementName+ReturnedMessagedata.StatusTextID).value=ReturnedMessagedata.StatusText;
	}
	if (typeof ReturnedMessagedata.Console != 'undefined'){//used to pass structured data to the console
		console.log(ReturnedMessagedata.Console);
		console.error("The use of this should be depreciated");
	}
	// Messages to the ProgressBar
	if (typeof ReturnedMessagedata.ProgressBarValue != 'undefined'){
		if (this.UseWithinSimProgressBar==true){
			document.getElementById(this.WithinSimProgressBarID+this.ThreadID).value=ReturnedMessagedata.ProgressBarValue;
		}
	}
	
	// Allow the function to run an arbitrary function
	if (typeof ReturnedMessagedata.Execute != 'undefined'){
		var FunctionToRun;
		eval("FunctionToRun=function(Data){"+ReturnedMessagedata.Execute.Code+"};");
		FunctionToRun(ReturnedMessagedata.Execute.Data);
		
		//Example usage:
		//SaySomething={};
		//SaySomething.Data="This is data";//NOte that Data can be an object, So there may be Data.Colour Data.Temperature
		//SaySomething.Code="console.log(Data);";
		//self.postMessage({Execute: SaySomething});
	}
	
	
	// Handle message functions that get added to the system 
	if (typeof(ReturnedMessagedata.MessageFunctionName) == 'string'){
		// Find the name in the array
		var IndexToRun=this.SimMessageFunctionArray.indexOf(ReturnedMessagedata.MessageFunctionName);
		// Execute the function
		this.InterfaceMessageFunctionArray[IndexToRun](ReturnedMessagedata.Data, ReturnedMessagesrcElement.SimID, e);
	}
	
	
	// Collect up results from this simulation, try to run next simulation
	if (typeof ReturnedMessagedata.Result != 'undefined'){
		this.NoThreadsCurrentlyRunning--;
		var SimID=ReturnedMessagedata.MTSMessage.SimID;
		this.Result[SimID]=ReturnedMessagedata.Result;//Store the results of the simulation
		this.SimsComplete++;
		var ThreadID=ReturnedMessagedata.MTSMessage.ThreadID;
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








