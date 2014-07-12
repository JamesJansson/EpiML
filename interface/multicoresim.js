// This object allows the user to perform multiple calculations over multiple cores
//

// Example usage:
// ScriptName="SimulationToRun.js"; 
// CommonData=[InfoBlock];//All sims will have access to this information
// SimSpecificDataArray=[67, 33, 99, 55, 88];//can be an array of any type (including other classes). Uses array length to determine the number of simulations to run.
// NoCores=6;//The number of cores you want the simulation to run over
// SimulationObject=new MulticoreSim(ScriptName, CommonData, SimSpecificDataArray, NoCores); // getting it ready
// SimulationObject.Start(); // Start the simulations running

// Sample set up of SimulationToRun.js
// ----------------------------------------------------------
// importScripts("usefulscripts1.js", "usefulscripts2.js");//Scripts your function needs to use (note; only scripts in the same folder can be used)
//
// self.onmessage = function (e) {
// 		var SimNumber = e.data.SimNumber;
// 		var SimData = e.data.SimData;
// 		var CommonData = e.data.CommonData;
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

function MulticoreSim(ScriptName, CommonData, SimDataArray, NoCores){
	
	this.ScriptName=ScriptName;
	this.CommonData=CommonData;
	this.SimDataArray=SimDataArray;//an array of values or objects to be passed to the specified script
	this.NoCores=NoCores;
	this.Worker=[];//An array of workers
	this.NoSims=SimDataArray.length;
	
	this.CurrentlyRunning=false;
	this.Complete=false;
	this.NoSimsCurrentlyRunning=0;
	
	this.SimsStarted=0;
	this.SimsComplete=0;
	this.Result=[];
	
	this.UseSimProgressBar=false;
	this.SimProgressBarID="SimProgressBar";//To allow a progress bar to be installed into the page
	this.UseWithinSimProgressBar=false;
	this.WithinSimProgressBarID="WithinSimProgressBar";
	
	

}

MulticoreSim.prototype.Start=function() {

	//Check that nothing else is running
	if (this.CurrentlyRunning==true){
		console.log("Warning: worker currently running");
		return 0;
	};
	this.CurrentlyRunning=true;
	this.NoSimsCurrentlyRunning=0;
	this.Complete=false;
	
	// Set progress bar to zero
	if (this.UseSimProgressBar==true){
		document.getElementById(this.SimProgressBarID).value=0;
	}
	
	//Create workers	
	this.RampUpSims();
};

MulticoreSim.prototype.RampUpSims=function() {

	MoreSimsToRun=true;//flag to prevent continually trying to run more sims
	while (this.NoSimsCurrentlyRunning<this.NoCores &&  MoreSimsToRun==true){//there are spare cores available
		if (this.SimsStarted<this.NoSims){//if there are sims that have yet to be started
			SimID=this.SimsStarted++;//run this sim, increment by 1
			this.NoSimsCurrentlyRunning++;//indicate that another core has become used
			
			this.Worker[SimID]= new Worker(this.ScriptName);
			
			var BoundMessage=MulticoreSimMessageHandler.bind(this);
			this.Worker[SimID].onmessage = BoundMessage;
			
			
			//Post message will soon become a handler for many commands, including starting the simulation, optimising the simulation, and requesting data
			this.Worker[SimID].postMessage({ SimNumber: SimID, CommonData: this.CommonData, SimData: this.SimDataArray[SimID]});
		}
		else{ //there are no more sims to run
			MoreSimsToRun=false;
		}
		
	}
	
	//Determine if this is the last sim to complete
	if (this.SimsComplete>=this.NoSims){
		this.Complete=true;
		//this.Terminate();//close all the workers
	}
}


MulticoreSimMessageHandler=function(e) {
	// There are 4 main message types that are handled
	// Messages to the StatusText (to be put somewhere on screen to indicate what is currently occurring)
	// Messages to the ProgressBar
	// Message to return result/indicate completeness
	// Receiving data from the Sim after a data request
	
	// Messages to the StatusText
	if (typeof e.data.StatusText != 'undefined'){
		console.log(e.data.WorkerStatusText);
	}
	// Messages to the ProgressBar
	if (typeof e.data.ProgressBarValue != 'undefined'){
		if (this.UseWithinSimProgressBar==true){
			document.getElementById(this.WithinSimProgressBarID).value=e.data.ProgressBarValue;
		}
	}
	if (typeof e.data.Result != 'undefined'){
		this.NoSimsCurrentlyRunning--;
		SimNumber=e.data.SimNumber;
		this.Result[SimNumber]=e.data.Result;//Store the results of the simulation
		this.SimsComplete++;
		
		this.RampUpSims();//Try to run more sims
		
		//Update the progress bar about completion
		if (this.UseSimProgressBar==true){
			document.getElementById(this.SimProgressBarID).value=this.SimsComplete/this.NoSims;
		}
	}
};

MulticoreSim.prototype.Terminate=function() {//close down all workers
	for (SimID=0; SimID<this.NoSims; SimID++){
		this.Worker[SimID].terminate();
	}	
	this.CurrentlyRunning==false;
};



