// This file contains the scripts that are called when the buttons on the interface are pressed.

var SimulationObject;
var SimData=[];
var Data={};
var Param={};

function RunSim(){
	ScriptToRun='model/runnotificationsimulation.js';
	
	var NumberOfSimsToRun=10;//this will later be set by the preferences in the interface

	// Load the values from the files
	
	Data.MaleNotifications={};
	Data.MaleNotifications.Table=DataFile.AgeSexNotifications.GetValues(4, 21, 1, 19);//get table indicates the range [rows][columns]
	Data.MaleNotifications.Age=DataFile.AgeSexNotifications.GetColumn(0, 4, 21);//GetColumn
	Data.MaleNotifications.Year=DataFile.AgeSexNotifications.GetRow(3, 1, 19);//GetRow
	
	Data.FemaleNotifications={};
	Data.FemaleNotifications.Table=DataFile.AgeSexNotifications.GetValues(25, 42, 1, 19);//get table indicates the range [rows][columns]
	Data.FemaleNotifications.Age=DataFile.AgeSexNotifications.GetColumn(0, 25, 42);//GetColumn
	Data.FemaleNotifications.Year=DataFile.AgeSexNotifications.GetRow(3, 1, 19);//GetRow	
	
	Data.StateNotifications={};
	Data.StateNotifications.Table=DataFile.StateNotifications.GetValues(29, 37, 1, 19);//get table indicates the range [rows][columns]
	Data.StateNotifications.State=DataFile.StateNotifications.GetColumn(0, 29, 37);//GetColumn
	Data.StateNotifications.Year=DataFile.StateNotifications.GetRow(3, 1, 19);//GetRow
	
	
	
	
	
	
	
	// Save into the Common holder
	var Common={};//
	Common.Data=Data;
	
	//Common.Param=Param;
	
	
	

	//Creating the data to be used in the simulations
	SimData=[];
	for (i=0; i<NumberOfSimsToRun; i++){
		SimData[i]={};
	}

	//Creating the parameter
	
	SimulationObject=new MulticoreSim(ScriptToRun, Common, SimData, NoCores); //Common is the same between all sims
	SimulationObject.UseSimProgressBar=true;
	SimulationObject.SimProgressBarID="MainProgress";
	SimulationObject.Start();




	return 0;
}

