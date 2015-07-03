function OptimiseFullModel(Notifications, OptimisationParameters){
	
	// Set up settings
	var FunctionInput={};
	// Set end simulation time to the last time in the notification data, plus 1 year
	FunctionInput.Notifications=Notifications;
	FunctionInput.EndSimulationTime=Notifications.Year(Notifications.Year.length-1);
	FunctionInput.Intervention={};
	
	var OptimisationSettings={};
	
	OptimisationSettings.Target=DEOArray;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		// change Param according to the values listed in ParameterSet
		Param.Whatever=ParameterSet["Whatever"];
		Param.Whatever=ParameterSet["Whatever"];
		
		
		var FullModelResults=Fullmodel(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		
		
		return FullModelResults;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){// Done, unchecked
		var DEOArray=Target;
		var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, Results);
		
		return TotalOptimisationError;
	};
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		
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
		PlotSomething.Code="ScatterPlot('#OptimisationPlotHolder0', Data,  'Step', 'Error Value');";
		self.postMessage({Execute: PlotSomething});
		
		// for each data found
		
		// for (key in this.Parameter){
		// 	CurrentParam=this.Parameter[key];
		// }
		
		
		//ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
	};
	
	OptimisationSettings.MaxTime=100;//stop after 10 seconds
	
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	
	// Add the optimisation parameters
	// OptimisationObject.AddParameter("Param.HCV.ProbabilityOfTransmission", 0, 1);
	for (var iOP in OptimisationParameters){
		OptimisationObject.AddParameter(OptimisationParameters[iOP].Name, OptimisationParameters[iOP].Lower, OptimisationParameters[iOP].Upper);//Param.IDU.NSP.P	
	}
	
	
	
	OptimisationObject.Run(FunctionInput);

	return OptimisationObject;
	
	// Function for model
	
	
	
	// Function got extracting results
	
	
	// 
	
	
	var ReturnResult={};
	ReturnResult=OptimisationArray;
	
}

// This function is operated on both in the 
function OptimisationArrayObject(){
	this.SimData;
	this.SimResult;
	this.DataExtractionFunction;
	this.Time; // An array of the times
	this.ChartFunction;
	this.Weight=1;// this is how much the difference between the aim and the result should be multiplied by
}


OptimisationArrayObject.prototype.ExtractData= function (Person){


};

OptimisationArrayObject.prototype.ClearFunctions= function (Person){
	// 

};

