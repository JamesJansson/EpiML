function  StochasticOptimisation(Settings){
	// Function: function to be optimised
	if (typeof Settings.Function==="function"){
		this.Function=Settings.Function;
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.Function should be set to the function you wish to optimise with inputs (FunctionInput, OptimisedParameterSet)");
		return -1;
	}
	// ErrorFuntion
	if (typeof Settings.ErrorFunction==="function"){
		this.ErrorFunction=Settings.ErrorFunction;// this function takes the results of the Function to be optimised, then outputs a score
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.ErrorFunction should be set to the function that will determine the error based on the result of Function");
		return -1;
	}
	// Target: Data to be optimised to
	if (typeof Settings.Target==="undefined"){
		console.error("In calling StochasticOptimisation(Settings), Settings.ErrorFunction should be set to the function that will determine the error based on the result of Function");
		return -1;
	}else{
		this.Target=Settings.Target;// The value that the error function uses to determine fitness
	}
	// ProgressFunction: Runs every round, can be used to output progress
	if (typeof Settings.ProgressFunction==="function"){
		this.RunProgressFunction=true;
		this.ProgressFunction=Settings.ProgressFunction;
	}else{
		this.RunProgressFunction=false;
	}
	
	// SeedValue: used to set a seed for Rand (if determinism is important and not set elsewhere)
	if (typeof Settings.SeedValue==="undefined"){// do nothing
	}else{
		Rand.SetSeed(Settings.SeedValue);// The seed value is used to reset the seed each time for the random number 
	}
	
	// FractionToKeep: a fraction of the total simulations per round that are chosen as the best simulations for that round
	if (typeof Settings.FractionToKeep==="undefined"){
		this.FractionToKeep=0.5;// standard fraction to keep
	}else{
		this.FractionToKeep=Settings.FractionToKeep;
	}
	
	// NumberOfSamplesPerRound: Number of points tested per round
	if (typeof Settings.NumberOfSamplesPerRound==="undefined"){
		this.NumberOfSamplesPerRound=100;// standard samples per round
	}else{
		this.NumberOfSamplesPerRound=Settings.NumberOfSamplesPerRound;
	}
	
	// MaxIterations: the number of iterations that can occur before the optimisation stops
	this.UserSpecifiedTermination=false;
	if (typeof Settings.MaxIterations==="undefined"){
		this.MaxIterations=1e9;// stop after x iterations
	}else{
		this.MaxIterations=Settings.MaxIterations;
		this.UserSpecifiedTermination=true;
	}

	// MaxTime: the total time (in seconds) before the optimisation stops
	if (typeof Settings.MaxTime==="undefined"){
		this.MaxTime=1e9;//standard stop time of 1e9 seconds
	}else{
		this.MaxTime=Settings.MaxTime;
		this.UserSpecifiedTermination=true;
	}
	
	if (this.UserSpecifiedTermination==false){
		console.log("Warning: a termination parameter was not set. This means that the algorithm will continue indefinitely");
	
	}
	
	
	
	
	this.Parameter=[];//an array of individual parameters, e.g. infection rate, cure rate
	this.NumberOfParameters=0;
	this.BestIndex=[];//Index of the best values from the CurrentVec array in each parameter
	
	this.SimResults=[];//An array of the output of the current round of simulations
	this.ErrorValues=[];//An array of the output of the current round of simulations
	
	// Determine if MathTools is running
	if (typeof MathToolsRunning==="undefined"){
		console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
	}else{
		if (MathToolsRunning==false){
			console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
		}
	}
	
	this.ReasonForTermination;// a string used to describe why the simulation has ended
	
	
	this.Help='Formats for structure\n Function(ParamForOptimisation) \n ';
}

StochasticOptimisation.prototype.AddParameter=function(Name, Min, Max){
	this.NumberOfParameters++;
	var A=new StochasticOptimisationParameter;
	A.Name=Name; // type is string
	A.Min=Min; // minimum value allowed in the optimisation
	A.Max=Max; // maximum value allowed in the optimisation
	// Add this parameter to the list of parameters to optimise
	this.Parameter[Name]=A;
}

StochasticOptimisation.prototype.Run= function (FunctionInput){
	//Set up the simulation for the first time
	for (var key in this.Parameter) {
		this.Parameter[key].InitiateParameter(this.NumberOfSamplesPerRound);
	}
	
	
	var ParameterSet;
	var OrderedIndex;

	// Keep running until time, number of sims runs out, or absolute error is reached, or precision is reached in all variables
	var RoundCount=0;
	var OptimisationComplete=false;
	var TimerStart = new Date().getTime() / 1000;
	var CurrentTime;
	while (OptimisationComplete==false){
		RoundCount++;
		// Run the simulation
		for (var SampleCount=0; SampleCount<this.NumberOfSamplesPerRound; SampleCount++){
			ParameterSet=this.GetParameterSet(SampleCount);
			this.SimResults[SampleCount]=this.Function(FunctionInput, ParameterSet);
			this.ErrorValues[SampleCount]=this.ErrorFunction(this.SimResults[SampleCount], this.Target);
		}
		
		// Work out which of this simulations will be selected
		// Sort by error level
		OrderedIndex=SortIndex(this.ErrorValues);
		this.BestIndex=OrderedIndex.slice(0, Round(this.NumberOfSamplesPerRound*this.FractionToKeep));
		for (var key in this.Parameter){
			this.Parameter[key].SelectBestPoints(this.BestIndex);// set the BestPoints array to the best values of the simulation
		}

		// If the OptimisationProgress function is set
		if (this.RunProgressFunction==true){
			this.ProgressFunction(RoundCount, this.Parameter, this.SimResults, this.ErrorValues);
		}
		
		// Test for various factors which would determine that the optimisation has completed. 
		//if (sum(this.SD)<){
		
		//}
		
		if (RoundCount>=this.MaxIterations){
			OptimisationComplete=true;
			this.ReasonForTermination="ReachedMaxIterations";
		}
		CurrentTime=new Date().getTime()/1000;
		if (CurrentTime-TimerStart>this.MaxTime){
			OptimisationComplete=true;
			this.ReasonForTermination="ReachedMaxTime";
		}
		
		// Preparing variables for next round of simulations
		if (OptimisationComplete==false){// we need to find more points for the next round of optimisation
			//Randomly select the next points
			var NextPointIndex=[];
			for (var key in this.BestIndex){
				NextPointIndex[key]=key;//the first x entries will be 1 through x
			}
			var RandomIndex;
			for (var i=this.BestIndex.length; i<this.NumberOfSamplesPerRound; i++){
				RandomIndex=Math.floor(this.BestIndex.length*Rand.Value());
				NextPointIndex[i]=RandomIndex;
			}
			// set and vary the next indices
			for (var key in this.Parameter){
				this.Parameter[key].SelectCurrentPoints(NextPointIndex);
				this.Parameter[key].Vary();
			}
		}
	}
}

// Get a single value 
StochasticOptimisation.prototype.GetParameterSet= function (ParameterNumber){
	ParameterSet={};
	for (key in this.Parameter) {
		ParameterSet[key]=this.Parameter[key].CurrentVec[ParameterNumber];
	}	
	return ParameterSet;
}

StochasticOptimisation.prototype.GetBestParameterSet= function (ParameterNumber){
	ParameterSet={};
	for (key in this.Parameter) {
		ParameterSet[this.Parameter[key].Name]=this.Parameter[key].BestVec[ParameterNumber];
	}	
	return ParameterSet;
}




//************************************************************
function StochasticOptimisationParameter(){
	this.Name;
	this.Min;
	this.Max;
	//this.CurrentRange;
	//this.AverageDistance;
	this.CurrentVec=[];//vector that stores all the current values
	this.BestVec=[];
	//this.BestValue;// the best value in the overall simulation 
	this.NumberOfDimensions;
	this.NumberOfSamplesPerRound;
	this.SD;
	this.SDHistory=[];
}

StochasticOptimisationParameter.prototype.InitiateParameter= function (NumberOfSamplesPerRound){
	this.NumberOfSamplesPerRound=NumberOfSamplesPerRound;
	for (var i=0; i<this.NumberOfSamplesPerRound; i++){
		this.CurrentVec[i]=this.Min+(this.Max-this.Min)*Rand.Value();
	}
}

StochasticOptimisationParameter.prototype.SelectBestPoints=function(BestIndexVec){
	var Count=0;
	for (var key in BestIndexVec){
		this.BestVec[Count]=this.CurrentVec[BestIndexVec[key]];
		Count++;
	}
}

StochasticOptimisationParameter.prototype.SelectCurrentPoints=function(SelectIndexVec){//takes a vector the length of the 
	var Count=0;
	for (var key in SelectIndexVec){
		this.CurrentVec[Count]=this.BestVec[SelectIndexVec[key]];
		Count++;
	}
	
}

StochasticOptimisationParameter.NumberOfSamplesPerRound;

StochasticOptimisationParameter.prototype.Vary= function (){
	// Perform a calculation to determine how much we want to vary the variable
	//this.CurrentRange=Math.max(this.BestVec)-Math.min(this.BestVec);
	//Variability=Math.pow(this.CurrentRange, 1/this.NumberOfDimensions);
	//var sum = 0;
    //for(var i = 0; i < this.Best.length; i++) {
    //    sum += this.Best[i];
    //}
    //var average = sum / this.Best.length;

	this.SD=SampleStandardDeviation(this.BestVec);
	this.SDHistory.push(this.SD);
	
	var RandomVariation;
	for (var i=0; i<this.NumberOfSamplesPerRound; i++){
		//try to vary
		ValueInRange=false;
		while (ValueInRange==false){// keep sampling if it is outside the allowable range
			VariedValue=NormalRand(this.CurrentVec[i], this.SD);//some function to change the variable.
			if (this.Min<VariedValue && VariedValue<this.Max){
				ValueInRange=true;
				this.CurrentVec[i]=VariedValue;
			}
		}
	}
}

//******************************************************************
function TestStochasticOptimisation(){
	// Create some example data
	// The aim of this is to determine what the mean (=7) and sd (=3) is from the distribution of the results
	// If the optimisation gets close to X=7 and Y=3, the optimisation is successful
	var HistogramsResults=HistogramData(NormalRandArray(7, 3, 10000), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	
	
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=10000;
	
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
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimResults, ErrorValues){
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









