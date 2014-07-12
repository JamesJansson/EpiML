var TMCSSimulationObject;
var TMCSSimData;

function TestMulticoreSim(){

NumberOfSimsToRun=10;

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