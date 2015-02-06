// This file holds the scripts that are run when buttons are pressed (to reduce the since of model.htm)

function SaveParameters(){
	var ParamJSONString=JSON.stringify(Param, null, 4);//gives 4 spaces between elements
	var blob = new Blob([ParamJSONString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "parameters.json");
}

function DownloadSimulationResults (){
	// Join the parameters, optimised parameters and simulations results into one.
	// Conver to JSON
	// Download results
}

function LoadSimulationResults(){
	// The purpose of this function is to open a file of previously run results 
	// This is either to run the simulation again with a change of parameters, or to inspect the results in the file.
}