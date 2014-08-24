// This file contains the scripts that are called when the buttons on the interface are pressed.

var NSSimulationObject;
var NSSimData;

function RunNotificationSim(){

var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

//

ScriptToRun='model/runnotificationsimulation.js';
TMCSSimData=[];
for (i=0; i<NumberOfSimsToRun; i++){
	TMCSSimData[i]={};
	TMCSSimData[i].NoPeople=30000;
}

NSSimulationObject=new MulticoreSim(ScriptToRun, 22, TMCSSimData, NoCores); 
NSSimulationObject.UseSimProgressBar=true;
NSSimulationObject.SimProgressBarID="MainProgress";
NSSimulationObject.Start();


//Note: TMCSSimData[a].PP[b] is an object, but does not contain a prototype
// TMCSSimData[a].PP[b].__proto__=PersonObject.prototype;
// this will also be useful in saving and reloading data

return 0;
}