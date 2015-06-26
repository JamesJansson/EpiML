function OptimiseFullModel(Notifications){
	
	// Set up settings
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=1000;
	
	OptimisationSettings.Target=DEOArray;
	
	// Set end simulation time to the last time in the notification data, plus 1 year
	FunctionInput.Notifications=Notifications;
	FunctionInput.EndSimulationTime=Notifications.Year(Notifications.Year.length-1);
	FunctionInput.Intervention={};
	
	var FullModelResults=FullModel(Notifications, EndSimulationTime, Intervention);

	
	
	
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		// change Param according to the values listed in ParameterSet
		Param.Whatever=ParameterSet.Whatever;
		Param.Whatever=ParameterSet.Whatever;
		Param.Whatever=ParameterSet.Whatever;
		Param.Whatever=ParameterSet.Whatever;
		
		
		
		var FullModelResults=Fullmodel(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		
		
		return FullModelResults;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){// Done, unchecked
		var DEOArray=Target;
		var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, Results);
		
		return TotalOptimisationError;
	};
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		disp(this);
		
		
		console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
		PSetCount=0;
		var Data=[];
		for (var key in Parameter.X.CurrentVec){
			Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
			PSetCount++;
		}
		
		Data.X=[1, 2, 3, 4, 5];
		Data.Y=;
		
		
		PlotSomething={};
		PlotSomething.Data=Data;
		PlotSomething.Code="ScatterPlot('#OptimisationPlotHolder0', Data,  'Step', 'Error Value');";
		self.postMessage({Execute: PlotSomething});
		
		// for each data found
		
		
		
		
		//ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
	};
	
	OptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("X", 0, 10);
	OptimisationObject.AddParameter("Y", 0, 10);
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


// the purpose of this array is to specify how the data is extracted from the model
var OptimisationArray=[];

// Number of people who have ever injected drugs in the last 12 months
OptimisationArray[0]=new OptimisationArrayObject();
OptimisationArray[0].Data=Data.PWID.EverFemale;//should be the same inside the simulation as outside, but may not be
OptimisationArray[0].Time=Data.PWID.EverFemale;//should be the same inside the simulation as outside, but may not be

OptimisationArray[0].DataExtractionFunction=function (Person){
};

OptimisationArray[0].ChartFunction=function (ResultsFromSim){
	
	
};


// Number of people who have ever injected drugs in the last 12 months