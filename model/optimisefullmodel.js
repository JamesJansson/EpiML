function OptimiseFullModel( WorkerData){
	
	// Set up the optimisation data
	var DEOArray = SetupDataExtractionObjects();
	
	
	OptimisationParam=WorkerData.Common.OptimisationParam;
	// name, min max
	
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

	
	
	// After the optimisatin is complete, pull the "best" parameterisaton
	
	// save it into Param
	
	// save result into OptimisationParam
	// OptimisationParam.Result
	
	
	
	
	var ReturnResult={};
	ReturnResult.OptimisationParam=OptimisationParam;
	
	
	
	var ErrorTimer=new RecordingTimer("ErrorTimer");
	ErrorTimer.Start();
	// Store a run for data as it would appear in the optimisation 
	var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, FullModelResults);
	console.error("The TotalOptimisationError is "+TotalOptimisationError);
	ErrorTimer.Stop();
	console.error("====================================");
	ErrorTimer.Display();
	
	// Generate graph data (external to the optimisation)
	RunAllDEOGenerateGraphData(DEOArray, FullModelResults);
	
	
	
	
	var ReturnResults={};
	// Store a run for data as it would appear in the optimisation 
	ReturnResults.DEOArray=DEOArray;
	ReturnResults.HCVDataDiagnosisResults=FullModelResults.HCVDataDiagnosisResults;
	
	return ReturnResults;
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

