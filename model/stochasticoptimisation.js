function  StochasticOptimisation(){
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	this.Function;
	this.PArray=[];
	
	this.ParamNow;// indicates the parameter that is currently being modified
	
	
	this.CurrentParameterArray=[];
	this.CurrentParameter={};
	
	this.SeedValue;// The seed value is used to reset the seed each time for the random number 
	
	this.Update;// this is a function that is run at the end of each round to, for example.
	
	
// start values
// start percentage change
// max/min values
// error function
// stop after x iterations/y seconds

	this.OptimisedParam;
	
	this.NumberOfSamplesPerRound=10;
	
	this.StopTime=1e9;//standard stop time of 1e9 seconds

	this.Help='formats for structure\n Function(ParamForOptimisation) \n Update(TrialNumber, Error)';
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
	this.PArray.push(A);
}



// This optimisation cycles through each of the parameters individually, adjusts it a little, runs and returns the results
// Note that if there is a dependence of one on the other, this must be programmed into the function that does the optimisation

StochasticOptimisation.prototype.Run= function (){
	//Set up the simulation for the first time
	for key in A {
		Parameter[Key].CurrentValue=
	}
	// Run the first sims to get the baseline error  
	this.BestError=this.Function(Constants
	
	
	// Keep running until time, number of sims runs out, or absolute error is reached, or precision is reached in all variables
	
	

}

StochasticOptimisation.prototype.BuildParameter= function (){
	var ParamStruct={};
	for ( in this.PArray){
		
	}
	
	return ParamStruct;
}



function StochasticOptimisationParameter(){
	this.Min;
	this.Max;
	this.CurrentRange;
	this.AverageDistance;
	this.CurrentVec=[];//vector that stores all the current values
	this.BestVec=[];
	this.BestValue;// the best value in the overall simulation 
	this.NumberOtherDimensions;
	this.NumberOfSamplesPerRound;
}

StochasticOptimisationParameter.prototype.InitiateVariable= function (NumberOfSamplesPerRound){
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

StochasticOptimisationParameter.prototype.Vary= function (){
	// Load CurrentVec with BestVec, then choose at random other values
	for (var key in this.BestVec){
		this.CurrentVec[key]=this.BestVec[key];
	}
	var RandomIndex;
	for (var i=this.BestVec.length; i<this.NumberOfSamplesPerRound; i++){
		RandomIndex=floor(this.BestVec.length*Rand.Value());
		this.CurrentVec[i]=this.BestVec[RandomIndex];
	}
	
	for (var i=0; i<this.NumberOfSamplesPerRound; i++){
		//try to vary
		ValueInRange=false;
		while (ValueInRange==false){// keep sampling if it is outside the allowable range
			if (this.Min<VariedValue && VariedValue<this.Max){
				ValueInRange=true;
			}
		}
		
		VariedValue
		
	}
}