var TMCSSimulationObject;
var TMCSSimData;

function TestMulticoreSim(){

ScriptToRun='model/runsimulation.js';
TMCSSimData=[];
for (i=0; i<10; i++){
	TMCSSimData[i]={};
	TMCSSimData[i].NoPeople=100000;
	TMCSSimData[i].Person=new PersonObject(3, 1989);
}
Cores=3;
TMCSSimulationObject=new MulticoreSim(ScriptToRun, 22, TMCSSimData, Cores); 
TMCSSimulationObject.Start();


//Note: TMCSSimData[a].PP[b] is an object, but does not contain a prototype
// TMCSSimData[a].PP[b].__proto__=PersonObject.prototype;
// this will also be useful in saving and reloading data

return 0;
}