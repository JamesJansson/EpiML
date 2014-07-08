// This object allows the user to perform multiple calculations over multiple cores
//

// Example usage:
// ScriptName="SimulationToRun.js"; 
// CommonData=[InfoBlock];//All sims will have access to this information
// SimSpecificData=[67, 33, 99, 55, 88];//can be an array of any type (including other classes). Uses array length to determine the number of simulations to run.
// NoCores=6;//The number of cores you want the simulation to run over
// SimulationObject=new MulticoreSim(ScriptName, CommonData, SimSpecificData, NoCores); // getting it ready
// SimulationObject.Start(); // Start the simulations running

// Sample set up of SimulationToRun.js
// ----------------------------------------------------------
// importScripts("usefulscripts1.js", "usefulscripts2.js");//Scripts your function needs to use (note; only scripts in the same folder can be used)
//
// self.onmessage = function (e) {
// 		var SimNumber = e.data.SimNumber;
// 		var SimSpecificData = e.data.SimSpecificData;
// 		var CommonData = e.data.CommonData;
//
//		...//Where you do the calculations
//		
//		Result.Value1=24;//Stores the results
//		Result.Value2=25;
//
//		self.postMessage({SimNumber: e.data.SimNumber, Result: Result});//All simulations should end with this line
//}



function MulticoreSim(ScriptName, CommonData, SimSpecificData, NoCores){

	this.ScriptName=ScriptName;
	this.CommonData=CommonData;
	this.SimSpecificData=SimSpecificData;//an array of values or objects to be passed to the specified script
	this.NoCores=NoCores;
	this.Worker=[];//An array of workers
	
	this.NoSims=SimSpecificData.length;
	this.SimsStarted=0;
	this.SimsComplete=0;
	this.Result=[];
	
	this.NoSimsCompleteProgressBarID="SimsCompleteProgressBar";//To allow a progress bar to be installed into the page
	this.SimSpecificProgessBarID="SimSpecificProgessBar";
	
	this.CurrentlyRunning=false;
	this.Complete=false;

}

MulticoreSim.prototype.Start=function() {
	//Check that nothing else is running
	if (this.CurrentlyRunning==true){
		console.log("Warning: worker currently running");
		return 0;
	};
	this.CurrentlyRunning=true;
	
	// Set progress bar to zero
	MainProgress.value=0;
	
	//Create workers	
	for (var CoreID = 0; CoreID < this.NoCores; CoreID++) {
		this.SimsStarted++;
        this.Worker[CoreID] = new Worker(this.ScriptName);
        this.Worker[CoreID].onmessage = this.MessageHandler;
		//Start the first sim on this core running
		this.Worker[CoreID].postMessage({ SimNumber: SimNumber, CommonData: CommonData, SimSpecificData: SimSpecificData});
    }
};

MulticoreSim.prototype.Terminate=function() {//close down all workers
	for (var CoreID = 0; CoreID < this.NoCores; CoreID++) {
		this.Worker[CoreID].terminate();
	}
	this.CurrentlyRunning==false;
};


MulticoreSim.prototype.MessageHandler=function(e) {
	// There are 3 main message types that are handled
	// Messages to the StatusText (to be put somewhere on screen to indicate what is currently occurring)
	// Messages to the ProgressBar
	// Message to return result/indicate completeness
	
	// Messages to the StatusText
	if (typeof e.data.StatusText != 'undefined'){
		console.log(e.data.WorkerStatusText);
	}
	// Messages to the ProgressBar
	if (typeof e.data.ProgressBarValue != 'undefined'){
		document.getElementById().value=e.data.ProgressBarValue;
	}
	if (typeof e.data.Result != 'undefined'){
		SimNumber=e.data.SimNumber;
		Result[SimNumber]=e.data.Result;
		this.SimsComplete++;
		//Determine if more sims need to be run
		
		if (this.SimsStarted<this.NoSims){
			//increment immediately
			this.SimsStarted++;
			SimToRun=this.SimsStarted-1;//Seems odd to do it this way, but it is designed to prevent overlap in simulations.
			//Run another sim
			this.Worker[CoreID].postMessage({ SimNumber: SimNumber, CommonData: CommonData, SimSpecificData: SimSpecificData});
		}
		
		
		
		//Determine if this is the last sim to complete
		if (this.SimsComplete>=this.NoSims){
			this.Terminate();//close all the workers
		}
	}
};




