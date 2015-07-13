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



function OptSelector(PointerToParamGroup, DEOGroup, Settings){
	// Working on the external PointerToParamGroup
	this.ParamGroup=PointerToParamGroup;
	// This means that when paramgroup is updated, this.ParamGroupUpdated is called
	this.ParamGroup.AddUpdateFunction(this.ParamGroupUpdated);
	
	// Setting up the optimisation variables	
	this.OptParamArray=[];
	this.OptOption=[];// is used for selecting whether the optimisation occurs or not
	this.ArrayOfOptimisedResults=[];
	
	
	this.DEOGroup=DEOGroup;
	
	// Use the DEO group to create a list of parameters to optimise to
	this.DEONameList=[];
	for (var DEOIndex in this.DEOGroup.DEOArray){
		this.DEONameList.push(this.DEOGroup.DEOArray[DEOIndex].Name);
	}
	
	
	//this.DEOFunctionList=[];// a text list of DEO functions that are used to build a DEO
	
	this.DEOToOpt=[];// this is ticked 
	this.DEOToGraph=[];// this is ticked 
	
	
	
	this.DisplayProgress=true;
	
	// Set up the threaded simulation that will run the optimisation
	
	
	// function to run on completion = this.CollateDEO
	
	// set the progress bar to the optimisation progress bar
	
	
	this.SimulationHolder=new MultiThreadSim();
	
	
	this.FunctionToRun=FunctionName
	this.Data
	
	this.InitialSetUpFunction="NameOfFunctionThatPerformsPreoptimisationSetup";// is a string that is stored to represent the 
	
	//DataExtractionObjectArray
	this.DEOArrayFunction="NameOfFunctionThatGeneratesDEOArrays";//

	this.ShutDownOnCompletion=Settings.ShutDownOnCompletion;
	this.NumberOfCores=Settings.NoCores;

	var InitialSetUpFunction=eval(WorkerData.Common.InitialSetUpFunction);
	var ModelFunction=eval(WorkerData.Common.ModelFunction);
	var PostOptimisationFunction=eval(WorkerData.Common.PostOptimisationFunction);
	
	

	
	// the information is sent to the worker, the worker finds the 

	this.Import();
	this.DEOArray=exec(this.DEOArrayFunction+"()");// run it in the interface
	this.DrawParamDiv();

}

OptSelector.prototype.Import=function (){
	//Clear the pointers to the optimsation array
	this.OptParamArray=[];
	this.OptOption=[];
	// go through param group, find optimisedsamples
	for (var PCount in this.ParamGroup.ParamArray){
		if (this.ParamGroup.ParamArray[PCount].DistributionType=='optimisedsample'){
			var CurrentOptParam=this.ParamGroup.ParamArray[PCount];//Pointer
			this.OptParamArray.push(CurrentOptParam);//Pointer to the actual value
			this.OptOption.push(false);
		}
	}
};



OptSelector.prototype.DrawParamDiv=function(){
	document.getElementById(this.DivID);
	
	// draw the outer section
		// Draw a button to run the optimisation
		// Draw a tick box that determines if the optimisation displays results after each round or not
		// Draw a drop down that allows the user to select the simulation that is displayed in the progress??
		// Draw a box that is used to display the progress of error with time
		// This plot takes each of the sims's historical data and makes a multi line plot that displays all of the plots on a single plot
		// http://www.flotcharts.org/flot/examples/series-toggle/index.html
		
	// for each optimisation parameter
	for (var PCount in this.OptParamArray){
		// Display the values as described in the ParamGroup
		// Draw a box that shows the progress of the error in this variable
		// Draw a box that displays that 
		
		// Display current results
			var Val=this.OptParamArray[PCount].Val;
			Mean(Val);// Mean
			SD(Val);// SD
			// 95% LCI 
			Percentile(Val, 2.5);
			// 95% UCI
			Percentile(Val, 97.5)
	}
	// for each optimisation data point 
};


OptSelector.prototype.ParamGroupUpdated=function(){
	this.Import();
	this.DrawParamDiv();
};




OptSelector.prototype.ClickRun=function(){
	// select display progress page?
	this.RunOptimisation();
		
};



OptSelector.prototype.RunOptimisation=function (){
	// Send the optimisation settings to the simulation  
	
	
	
	// Run the simulation
	this.SimulationHolder.Run();
	// wait for the result
	
	// collect up the data when finished
};


OptSelector.prototype.PushToParamGroup=function (){
	// Takes array of optimised results
	// pushes to the paramgroup
	// Saves the results to file Param.Save 
};



OptSelector.prototype.ParamGroupUpdated=function (){
	this.DrawTable();
}


// This function is inside the model and is called 
// Note that 
function OptSelectorHandler(WorkerData){
	// There are typically three main functions that the optimisation is handed 
	// WorkerData.Common.InitialSetUpFunction
	// WorkerData.Common.ModelFunction
	// WorkerData.Common.PostOptimisationFunction
	
	var OptSelectorSettings=WorkerData.Common.OptSelectorSettings;
	
	
	// Set up the optimisation data extraction objects
	var DEOFunctionList=OptSelectorSettings.DEOFunctionList;
	
	for (var DEOFunctionCount in DEOFunctionList){
		var DEOOptGroup = new DataExtractionObjectGroup();	
		
	}
	
	
	
	
	
	// Create the general 
	
	
	
	
	var DEOArrayFunction=eval(OptSelectorSettings.DEOArrayFunction);
	var DEOArray = DEOArrayFunction();
	// Set up the parameters
	var OptimisationParam=WorkerData.Common.OptimisationParam;
	Param=WorkerData.SimData.Param;
	
	
	
	
	// Extract the ModelFunction to optimise
	if (typeof(WorkerData.Common.ModelFunction)=="undefined"){
		throw "ModelFunction was not set.";
	}
	else{
		var ModelFunction=eval(WorkerData.Common.ModelFunction);
	}
	
	
	// Extract and run the InitialSetUpFunction if it exists
	if (typeof(WorkerData.Common.InitialSetUpFunction)!="undefined"){
		var InitialSetUpFunction=eval(WorkerData.Common.InitialSetUpFunction);
		// Run the pre-code
		var InitialSetUpInput={};
		InitialSetUpInput.Param=Param;
		InitialSetUpInput.DEOArray=DEOArray;
		InitialSetUpInput.ModelFunction=ModelFunction;
		InitialSetUpInput.WorkerData=WorkerData;
		
		InitialSetUpFunction(InitialSetUpInput);
	}
	
	
	
	
	var OptimisationSettings={};
	OptimisationSettings.Target=DEOArray;
	
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		// change Param according to the values listed in ParameterSet
		for (var Identifier in ParameterSet){
			eval("Param." + Identifier +"=ParameterSet["+Identifier+"];" );	
		}
		
		Param.Whatever=ParameterSet["Whatever"];
		Param.Whatever=ParameterSet["Whatever"];
		
		
		
		var FullModelResults=ModelFunction(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		
		
		return FullModelResults;
	};
	
	
	OptimisationSettings.ErrorFunction=function(Results, Target){// Done, unchecked
		var DEOArray=Target;
		var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, Results);
		
		return TotalOptimisationError;
	};
	
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		if (Common.DisplayProgress==true){
			console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
			var PSetCount=0;
			var Data=[];
			for (var key in Parameter.X.CurrentVec){
				Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
				PSetCount++;
			}
			
			
			Data.Y=this.MeanError;
			Data.X=AscendingArray(0, this.MeanError.length-1);
			
			
			PlotSomething={};
			PlotSomething.Data=Data;
			PlotSomething.Code="ScatterPlot('#"+ Common.OptimisationPlotID+ "OptimisationPlotHolder0', Data,  'Step', 'Error Value');";
			self.postMessage({Execute: PlotSomething});
			
			// Parse back the historical error for the total and each data pulled
			
			
			
			
			// for each data found
			
			// for (key in this.Parameter){
			// 	CurrentParam=this.Parameter[key];
			// }
			
			
			//ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
		}
	};
	
	
	
	
	var OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	
	// Add the optimisation parameters
	// OptimisationObject.AddParameter("Param.HCV.ProbabilityOfTransmission", 0, 1);
	for (var iOP in OptimisationParameters){
		OptimisationObject.AddParameter(OptimisationParameters[iOP].Name, OptimisationParameters[iOP].Lower, OptimisationParameters[iOP].Upper);//Param.IDU.NSP.P	
	}
	
	OptimisationObject.Run(FunctionInput);
	
	
	if (typeof(WorkerData.Common.PostOptimisationFunction)!="undefined"){
		var PostOptimisationFunction=eval(WorkerData.Common.PostOptimisationFunction);
		// Run the pre-code
		ReturnedResults.PostOptimisation=PostOptimisationFunction(Param, DEOArray, WorkerData);
	}
	
	
	
	
	return ReturnedResults;
}


