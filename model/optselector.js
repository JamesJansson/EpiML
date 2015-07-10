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



function OptSelector(PointerToParamGroup, Settings){
	this.ParamGroup=PointerToParamGroup;
	// This means that when paramgroup is updated, this.ParamGroupUpdated is called
	this.ParamGroup.AddUpdateFunction(this.ParamGroupUpdated);
	
	this.OptParamArray=[];
	
	this.OptOption=[];// is used for selecting whether the optimisation occurs or not
	
	this.DisplayProgress=true;
	
	// function to run on completion = this.CollateDEO
	
	this.SimulationHolder=new MultiThreadSim();
	
	
	this.FunctionToRun=FunctionName
	this.Data
	
	this.InitialSetUpFunction="NameOfFunctionThatPerformsPreoptimisationSetup";// is a string that is stored to represent the 
	
	//DataExtractionObjectArray
	this.DEOArrayFunction="NameOfFunctionThatGeneratesDEOArrays";//

	this.ShutDownOnCompletion=Settings.ShutDownOnCompletion;
	this.NumberOfCores=Settings.NoCores;

	
	this.ArrayOfOptimisedResults=[];

	
	// the information is sent to the worker, the worker finds the 

	this.Import();
	this.DEOArray=exec(this.DEOArrayFunction+"()");// run it locally. 
	this.DrawParamDiv();

}

OptSelector.prototype.Import=function (){
	//Clear the pointers to the optimsation array
	this.OptParamArray=[];
	this.OptOption=[];
	// go through param group, find optimisedsamples
	for (var PCount in this.ParamGroup.ParamArray){
		if (this.ParamGroup.ParamArray[PCount]=='optimisedsample'){
			var CurrentOptParam=this.ParamGroup.ParamArray[PCount];//Pointer
			this.OptParamArray.push(CurrentOptParam);//Pointer
			this.OptOption.push(false);
			// find the high and the low ranges of the parameters
			// Display current results
				// Mean
				// SD
				// 95% LCI 
				// 95% UCI
				
			// 
		}
	}
};



OptSelector.prototype.DrawParamDiv=function(){
	// draw the outer section
		// Draw a button to run the optimisation
		// Draw a tick box that determines if the optimisation displays results after each round or not
		// Draw a drop down that allows the user to select the simulation that is displayed in the progress??
		// Draw a box that is used to display the progress of error with time
		// This plot takes each of the sims's historical data and makes a multi line plot that displays all of the plots on a single plot
		// http://www.flotcharts.org/flot/examples/series-toggle/index.html
		
	// for each optimisation parameter
		// Display the values as described in the ParamGroup
		// Draw a box that shows the progress of the error in this variable
		// Draw a box that displays that 
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
	var OptSelectorSettings=WorkerData.Common.OptSelectorSettings;
	// Set up the optimisation data
	var DEOArrayFunction=eval(OptSelectorSettings.DEOArrayFunction);
	var DEOArray = DEOArrayFunction();
	// Set up the parameters
	var OptimisationParam=WorkerData.Common.OptimisationParam;
	Param=WorkerData.SimData.Param;
	
	// There are typically three main functions that the optimisation is handed 
	var InitialSetUpFunction=eval(WorkerData.Common.InitialSetUpFunction);
	var ModelFunction=eval(WorkerData.Common.ModelFunction);
	var PostOptimisationFunction=eval(WorkerData.Common.PostOptimisationFunction);
	
	// Run the pre-code
	InitialSetUpFunction(Param, DEOArray, WorkerData);
	
	
	
	
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
	
	return SimulationResults();
		
}


