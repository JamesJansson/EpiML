// This file contains the scripts that are called when the buttons on the interface are pressed.

var SimulationObject;
var SimData;
var Data={};
var Param={};

function RunSim(){
	ScriptToRun='model/runnotificationsimulation.js';
	
	var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

	// Load the values from the files
	
	
	
	
	// Save into the CommonData holder
	var CommonData={};//
	CommonData.Data=Data;
	CommonData.Param=Param;
	
	
	

	//Creating the data to be used in the simulations
	NSSimData=[];
	for (i=0; i<NumberOfSimsToRun; i++){
		NSSimData[i]={};
		NSSimData[i].NoPeople=30000;
	}

	//Creating the parameter
	
	SimulationObject=new MulticoreSim(ScriptToRun, CommonData, SimData, NoCores); //CommonData is the same between all sims
	SimulationObject.UseSimProgressBar=true;
	SimulationObject.SimProgressBarID="MainProgress";
	SimulationObject.Start();




	return 0;
}

