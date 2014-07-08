var SimulationObject;

function TestMulticoreSim(){

ScriptToRun='model/runsimulation.js';
SimData=[];
for (i=0; i<10; i++){
	SimData[i]={};
	SimData[i].NoPeople=10000;
}
Cores=3;
SimulationObject=new MulticoreSim(ScriptToRun, 22, SimData, Cores); 
SimulationObject.Start();
return 0;
}