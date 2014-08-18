// This file contains the scripts that are called when the buttons on the interface are pressed.

var TMCSSimulationObject;
var TMCSSimData;

function RunNotificationSim(){

var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

//

ScriptToRun='model/runsimulation.js';
TMCSSimData=[];
for (i=0; i<NumberOfSimsToRun; i++){
	TMCSSimData[i]={};
	TMCSSimData[i].NoPeople=30000;
}

TMCSSimulationObject=new MulticoreSim(ScriptToRun, 22, TMCSSimData, NoCores); 
TMCSSimulationObject.UseSimProgressBar=true;
TMCSSimulationObject.SimProgressBarID="MainProgress";
TMCSSimulationObject.Start();


//Note: TMCSSimData[a].PP[b] is an object, but does not contain a prototype
// TMCSSimData[a].PP[b].__proto__=PersonObject.prototype;
// this will also be useful in saving and reloading data

return 0;
}