// This file contains the scripts that are called when the buttons on the interface are pressed.

var SimulationObject;
var NSSimData;

function RunSim(Settings, Parameters, ){
	ScriptToRun='model/runnotificationsimulation.js';
	
	var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

	//

	

	//Creating the data to be used in the simulations
	NSSimData=[];
	for (i=0; i<NumberOfSimsToRun; i++){
		NSSimData[i]={};
		NSSimData[i].NoPeople=30000;
	}

	//Creating the parameter
	
	SimulationObject=new MulticoreSim(ScriptToRun, 22, NSSimData, NoCores); //22 is common data (same between all sims)
	SimulationObject.UseSimProgressBar=true;
	SimulationObject.SimProgressBarID="MainProgress";
	SimulationObject.Start();




	return 0;
}

