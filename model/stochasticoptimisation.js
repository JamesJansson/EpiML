function  StochasticOptimisation(Settings){
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	if (typeof Settings.Function==="function"){
		this.Function=Settings.Function;
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.Function should be set to the function you wish to optimise with inputs (FunctionInput, OptimisedParameterSet)");
	}
	if (typeof Settings.Function==="function"){
		this.ErrorFunction=Settings.ErrorFunction;// this function takes the results of the Function to be optimised, then outputs a score
	}else{
		console.error("In calling StochasticOptimisation(Settings), Settings.ErrorFunction should be set to the function that will determine the error based on the result of Function");
	}

	if (typeof Settings.SeedValue==="undefined"){
	}else{
		Rand.SetSeed(Settings.SeedValue);// The seed value is used to reset the seed each time for the random number 
	}
	
	
	if (typeof Settings.SeedValue==="undefined"){
		this.FractionToKeep=0.5;// standard fraction to keep
	}else{
		this.FractionToKeep=Settings.FractionToKeep;
	}
	
	if (typeof Settings.SeedValue==="undefined"){
		this.NumberOfSamplesPerRound=10;// standard samples per round
	}else{
		this.NumberOfSamplesPerRound=Settings.NumberOfSamplesPerRound;
	}

// stop after x iterations/y seconds

	this.OptimisedParam;
	
	
	this.StopTime=1e9;//standard stop time of 1e9 seconds

	this.Help='Formats for structure\n Function(ParamForOptimisation) \n ';
	
	// Try MathToolsRunning
	if (typeof MathToolsRunning==="undefined"){
		console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
	}else{
		if (MathToolsRunning==false){
			console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
		}
	}
	
	
	this.Parameter=[];//an array of individual parameters, e.g. infection rate, cure rate
	
	//this.ErrorValues=[];
	this.BestIndex=[];
	
}
StochasticOptimisation.prototype.AddParameter=function(P){
	var A=new StochasticOptimisationParameter;
	A.Name=P.Name;
	A.StartValue=P.StartValue;
	A.CurrentValue=P.StartValue;
	A.FractionalChange=P.FractionalChange;
	A.Min=P.Min;
	A.Max=P.Max;
	// Add this parameter to the list of parameters to optimise
	this.Parameter.push(A);
}



// This optimisation cycles through each of the parameters individually, adjusts it a little, runs and returns the results
// Note that if there is a dependence of one on the other, this must be programmed into the function that does the optimisation

StochasticOptimisation.prototype.Run= function (FunctionInput){
	//Set up the simulation for the first time
	for (var key in this.Parameter) {
		this.Parameter[Key].InitiateParameter(this.NumberOfSamplesPerRound);
	}
	
	
	var ParameterSet;
	var OrderedIndex;
	var SimResults;
	// Keep running until time, number of sims runs out, or absolute error is reached, or precision is reached in all variables
	OptimisationComplete=false;
	while (OptimisationComplete==false){
		for (var PSetCount=0; PSetCount<this.NumberOfSamplesPerRound; PSetCount++){
			ParameterSet=this.GetParameterSet(PSetCount);
			SimResults=this.Function(FunctionInput, ParameterSet);
			this.ErrorValues[PSetCount]=this.ErrorFunction(SimResults);
		}
		
		// Work out which of this simulations will be selected
		// Sort by error level
		OrderedIndex=SortIndex(this.ErrorValues);
		this.BestIndex=OrderedIndex.slice(0, this.NumberOfSamplesPerRound*this.FractionToKeep);
		for (var key in this.Parameter){
			this.Parameter[key].SelectBestPoints(this.BestIndex);// set the BestPoints array to the best values of the simulation
		}
		
		
		
		// 
		
		
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
		ParameterSet[Parameter[key].Name]=this.Parameter[key].CurrentVec[ParameterNumber];
	}	
	return ParameterSet;
}

StochasticOptimisation.prototype.]]]]]]]]]]]]]]]]= function (ParameterNumber){
	// Load CurrentVec with BestVec, then choose at random other values
	for (var key in this.BestVec){
		this.CurrentVec[key]=this.BestVec[key];
	}
	var RandomIndex;
	for (var i=this.BestVec.length; i<this.NumberOfSamplesPerRound; i++){
		RandomIndex=floor(this.BestVec.length*Rand.Value());
		this.CurrentVec[i]=this.BestVec[RandomIndex];
	}
	
	return 
}




//************************************************************
function StochasticOptimisationParameter(){
	this.Name;
	this.Min;
	this.Max;
	this.CurrentRange;
	this.AverageDistance;
	this.CurrentVec=[];//vector that stores all the current values
	this.BestVec=[];
	this.BestValue;// the best value in the overall simulation 
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