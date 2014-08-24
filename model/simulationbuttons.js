// This file contains the scripts that are called when the buttons on the interface are pressed.

var NSSimulationObject;
var NSSimData;

function RunNotificationSim(){

var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

//

ScriptToRun='model/runnotificationsimulation.js';

//Creating the data to be used in the simualtions
NSSimData=[];
for (i=0; i<NumberOfSimsToRun; i++){
	NSSimData[i]={};
	NSSimData[i].NoPeople=30000;
}

NSSimulationObject=new MulticoreSim(ScriptToRun, 22, NSSimData, NoCores); 
NSSimulationObject.UseSimProgressBar=true;
NSSimulationObject.SimProgressBarID="MainProgress";
NSSimulationObject.Start();




return 0;
}