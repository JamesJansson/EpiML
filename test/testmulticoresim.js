var TMCSSimulationObject;
var TMCSSimData;

function TestMulticoreSim(){

ScriptToRun='model/runsimulation.js';
TMCSSimData=[];
for (i=0; i<10; i++){
	TMCSSimData[i]={};
	TMCSSimData[i].NoPeople=100000;
}
Cores=3;
TMCSSimulationObject=new MulticoreSim(ScriptToRun, 22, TMCSSimData, Cores); 
TMCSSimulationObject.Start();
return 0;
}