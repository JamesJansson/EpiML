// The purpose of this 

// Is given a pointer to a parameter group
// It provides the interface to the optimisation:
	// The optimised parameters of the model can be selected
	// Has an option to selected the function that will determine the data to optimise to 
	// Has an option which allows the parameter group to recalculated
		// Time stamp of the parameter group and when it was 
	// Displays the model being run (optimisation specific graphs)
// Creates a simulation, runs the optimisation, shuts down

// Stores the data back into the parameter group

// Saves the parameter group (with the optimisation inside)



function OptimisationSelector(PointerToParamGroup, Settings){
	this.ParamGroup=PointerToParamGroup;
	
	this.SimulationHolder=new MultiThreadSim();
	this.FunctionToRun=FunctionName
	this.Data
	
	this.InitialSetUpFunction="NameOfFunctionThatPerformsPreoptimisationSetup";// is a string that is stored to represent the 
	
	//DataExtractionObjectArray
	this.DEOArrayFunction="NameOfFunctionThatGeneratesDEOArrays";//

	this.ShutDownOnCompletion=true;


	OptimisationSelector.prototype.Import=function ()
	
	OptimisationSelector
	
	// the informations is sent to the worker, the worker finds the 


}

OptimisationSelector.prototype.ClickRun(){
	// select display progress page?
	this.RunOptimisation();
		
}



OptimisationSelector.prototype.RunOptimisation=function (){
	// Send the optimisation settings to the simulation  
	
	// wait for the result
	
	// collect up the data when finished
};






OptimisationSelectorHandler(WorkerData){
	// 
	// Set up the optimisation data
	var DEOArrayFunction=eval(WorkerData.Common.DEOArrayFunction);
	var DEOArray = DEOArrayFunction();
	// Set up the parameters
	var OptimisationParam=WorkerData.Common.OptimisationParam;
	
	// 
	Param
	
	
	// Run the pre-code
	var InitialSetUpFunction=WorkerData.Common.InitialSetUpFunction;
	InitialSetUpFunction();
	
	
	var Optimisation=new 
	
	var OptimisationSettings={};
	
	OptimisationSettings.Target=DEOArray;
	
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		// change Param according to the values listed in ParameterSet
		for (var Identifier in ParameterSet){
			eval("Param." + Identifier +"=ParameterSet["+Identifier+"];" );	
		}
		
		Param.Whatever=ParameterSet["Whatever"];
		Param.Whatever=ParameterSet["Whatever"];
		
		
		var FullModelResults=Fullmodel(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		
		
		return FullModelResults;
	};
	
	
	
	
	
	
	return SimulationResults();
		
}


