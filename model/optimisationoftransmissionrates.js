Opimisation of exit rate

Optimisation of starting levels and transmission

new StochasticOptimisation(Settings)

ProgressFunction



function OptimiseTransmission(){
	// Create some example data
	// The aim of this is to determine what the mean (=7) and sd (=3) is from the distribution of the results
	// If the optimisation gets close to X=7 and Y=3, the optimisation is successful
	var HistogramsResults=HistogramData(NormalRandArray(7, 3, 1000), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	
	
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=1000;
	
	OptimisationSettings.Target=HistogramsResults.Count;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		//console.log(ParameterSet);
		//console.log(ParameterSet.Y);
		var Results=NormalRandArray(ParameterSet.X, ParameterSet.Y, FunctionInput.NumberOfSamples);
		return Results;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var CurrentHistogramsResults=HistogramData(Results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		var TotalError=Sum(Abs(Minus(CurrentHistogramsResults.Count, Target)));
		return TotalError;
	};
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
		PSetCount=0;
		Data=[];
		for (var key in Parameter.X.CurrentVec){
			Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
			PSetCount++;
		}
		
		PlotSomething={};
		PlotSomething.Data=Data;
		PlotSomething.Code="FixedAxisScatterPlot('#PlotHolder', Data,  'AAA', 'BBB', 0, 10, 0, 10);";
		self.postMessage({Execute: PlotSomething});
		
		
		//ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
	};
	
	OptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("X", 0, 10);
	OptimisationObject.AddParameter("Y", 0, 10);
	OptimisationObject.Run(FunctionInput);
	
	
	return OptimisationObject;
}

function CreateHCVInfections(Settings){
	// 


}





