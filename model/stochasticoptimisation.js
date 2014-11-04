function  StochasticOptimisation(Settings){
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	if (typeof Settings.Function==="function"){
		this.Function=Settings.Function;
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.Function should be set to the function you wish to optimise with inputs (FunctionInput, OptimisedParameterSet)");
		return -1;
	}
	if (typeof Settings.ErrorFunction==="function"){
		this.ErrorFunction=Settings.ErrorFunction;// this function takes the results of the Function to be optimised, then outputs a score
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.ErrorFunction should be set to the function that will determine the error based on the result of Function");
		return -1;
	}
	if (typeof Settings.Target==="undefined"){
		console.error("In calling StochasticOptimisation(Settings), Settings.ErrorFunction should be set to the function that will determine the error based on the result of Function");
		return -1;
	}else{
		this.Target=Settings.Target;// The value that the error function uses to determine fitness
	}
	
	

	if (typeof Settings.SeedValue==="undefined"){
	}else{
		Rand.SetSeed(Settings.SeedValue);// The seed value is used to reset the seed each time for the random number 
	}
	
	
	if (typeof Settings.FractionToKeep==="undefined"){
		this.FractionToKeep=0.5;// standard fraction to keep
	}else{
		this.FractionToKeep=Settings.FractionToKeep;
	}
	
	if (typeof Settings.NumberOfSamplesPerRound==="undefined"){
		this.NumberOfSamplesPerRound=10;// standard samples per round
	}else{
		this.NumberOfSamplesPerRound=Settings.NumberOfSamplesPerRound;
	}
	
	if (typeof Settings.MaxIterations==="undefined"){
		this.MaxIterations=1000;// stop after x iterations
	}else{
		this.MaxIterations=Settings.MaxIterations;
	}

	if (typeof Settings.MaxTime==="undefined"){
		this.MaxTime=1e9;//standard stop time of 1e9 seconds
	}else{
		this.MaxTime=Settings.MaxTime;
	}
	
	this.Parameter=[];//an array of individual parameters, e.g. infection rate, cure rate
	
	this.BestIndex=[];
	
	this.SimResults=[];//An array of the output of the current round of simulations
	this.ErrorValues=[];//An array of the output of the current round of simulations
	
	// Try MathToolsRunning
	if (typeof MathToolsRunning==="undefined"){
		console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
	}else{
		if (MathToolsRunning==false){
			console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
		}
	}
	
	this.Help='Formats for structure\n Function(ParamForOptimisation) \n ';
}
StochasticOptimisation.prototype.AddParameter=function(Name, Min, Max){
	var A=new StochasticOptimisationParameter;
	A.Name=Name; // type is string
	A.Min=Min; // minimum value allowed in the optimisation
	A.Max=Max; // maximum value allowed in the optimisation
	// Add this parameter to the list of parameters to optimise
	this.Parameter[Name]=A;
}



// This optimisation cycles through each of the parameters individually, adjusts it a little, runs and returns the results
// Note that if there is a dependence of one on the other, this must be programmed into the function that does the optimisation

StochasticOptimisation.prototype.Run= function (FunctionInput){
	//Set up the simulation for the first time
	for (var key in this.Parameter) {
		this.Parameter[key].InitiateParameter(this.NumberOfSamplesPerRound);
	}
	
	
	var ParameterSet;
	var OrderedIndex;

	// Keep running until time, number of sims runs out, or absolute error is reached, or precision is reached in all variables
	OptimisationComplete=false;
	while (OptimisationComplete==false){
		for (var key in this.Parameter){
			ParameterSet=this.GetParameterSet(key);
			this.SimResults[key]=this.Function(FunctionInput, ParameterSet);
			this.ErrorValues[key]=this.ErrorFunction(this.SimResults[key], this.Target);
		}
		
		// Work out which of this simulations will be selected
		// Sort by error level
		OrderedIndex=SortIndex(this.ErrorValues);
		this.BestIndex=OrderedIndex.slice(0, Round(this.NumberOfSamplesPerRound*this.FractionToKeep));
		for (var key in this.Parameter){
			this.Parameter[key].SelectBestPoints(this.BestIndex);// set the BestPoints array to the best values of the simulation
		}

		// Test for various factors which would determine that the optimisation has completed. 
		//if (sum(this.SD)<){
		OptimisationComplete=true;
		//}
		
		if (OptimisationComplete==false){// we need to find more points for the next round of optimisation
			//Randomly select the next points
			var NextPointIndex=[];
			for (var key in this.BestVec){
				NextPointIndex[key]=key;//the first x entries will be 1 through x
			}
			var RandomIndex;
			for (var i=this.BestVec.length; i<this.NumberOfSamplesPerRound; i++){
				NextPointIndex[i]=floor(this.BestVec.length*Rand.Value());
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
		ParameterSet[this.Parameter[key].Name]=this.Parameter[key].CurrentVec[ParameterNumber];
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
			RandomVariation=NormalRand(this.CurrentVec[i], this.SD);//some function to change the variable.
			VariedValue=this.CurrentVec[i]+RandomVariation;
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
	var HistogramsResults=HistogramData(NormalRandArray(7, 3, 100), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	
	
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=100;
	
	OptimisationSettings.Target=HistogramsResults.Count;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		var Results=NormalRandArray(ParameterSet.X, ParameterSet.Y, FunctionInput.NumberOfSamples);
		return Results;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var CurrentHistogramsResults=HistogramData(Results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		var TotalError=Sum(Abs(Minus(CurrentHistogramsResults.Count, Target)));
		return TotalError;
	};
	
	OptimisationSettings.DisplayFunction=function(Parameters, Results, Error){
		//Parameters[i].CurrentVec
	};
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("X", 0, 10);
	OptimisationObject.AddParameter("Y", 0, 10);
	
	OptimisationObject.Run(FunctionInput);
	
	
	return OptimisationObject;
}









