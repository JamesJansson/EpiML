function  StochasticOptimisation(){
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	this.Function;
	this.Parameter=[];//an array of individual parameters
	this.ErrorFunction;//a function that describes how the error is calculated
	// this function takes the results of the Function to be optimised, then outputs a score
	this.ErrorValues=[];
	this.BestIndex=[];
	
	this.SeedValue;// The seed value is used to reset the seed each time for the random number 
	
	
	
// start values
// start percentage change
// max/min values
// error function
// stop after x iterations/y seconds

	this.OptimisedParam;
	
	this.NumberOfSamplesPerRound=10;
	
	this.StopTime=1e9;//standard stop time of 1e9 seconds

	this.Help='Formats for structure\n Function(ParamForOptimisation) \n ';
	
	// Try MathToolsRunning
	if (MathToolsRunning==false){
		console.error('The file mathtools.js has not been included. This package is necessary to use this optimisation methodology.');
	}
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
	for (key in this.Parameter) {
		this.Parameter[Key].InitiateParameter(this.NumberOfSamplesPerRound);
	}
	// Run the first sims to get the baseline error  
	for (var PCount=0; PCount<NumberOfSamplesPerRound; PCount++){
		
		this.BestError=this.Function(FunctionInput, ParameterSet);
	}
	
	
	// Keep running until time, number of sims runs out, or absolute error is reached, or precision is reached in all variables
	
	

}

StochasticOptimisation.prototype.GetParameterSet= function (ParameterNumber){
	// Load CurrentVec with BestVec, then choose at random other values
	for (var key in this.BestVec){
		this.CurrentVec[key]=this.BestVec[key];
	}
	var RandomIndex;
	for (var i=this.BestVec.length; i<this.NumberOfSamplesPerRound; i++){
		RandomIndex=floor(this.BestVec.length*Rand.Value());
		this.CurrentVec[i]=this.BestVec[RandomIndex];
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
}

StochasticOptimisationParameter.prototype.InitiateParameter= function (NumberOfSamplesPerRound){
	this.NumberOfSamplesPerRound=NumberOfSamplesPerRound;
	for (var i=0; i<this.NumberOfSamplesPerRound; i++){
		this.CurrentVec[i]=this.Min+(this.Max-this.Min)*Rand.Value();
	}
}

StochasticOptimisationParameter.prototype.SelectBest=function(BestIndexVec){
	var Count=0;
	for (var key in BestIndexVec){
		this.BestVec[Count]=this.CurrentVec[BestIndexVec[key]];
		Count++;
	}
}

StochasticOptimisationParameter.prototype.SelectNextPoint=function(SelectIndexVec){//takes a vector the length of the 
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

	SD=SampleStandardDeviation(this.BestVec);

	var RandomVariation;
	for (var i=0; i<this.NumberOfSamplesPerRound; i++){
		//try to vary
		ValueInRange=false;
		while (ValueInRange==false){// keep sampling if it is outside the allowable range
			RandomVariation=NormalRand(this.CurrentVec[i], SD);//some function to change the variable.
			VariedValue=this.CurrentVec[i]+RandomVariation;
			if (this.Min<VariedValue && VariedValue<this.Max){
				ValueInRange=true;
				this.CurrentVec[i]=VariedValue;
			}
		}
	}
}