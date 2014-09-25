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
	for Parameter parameter
		Parameter[Key].CurrentValue=
	// Run the first optimisation 
	this.BestError=this.Function(Constants

}

StochasticOptimisation.prototype.BuildParameter= function (){
	var ParamStruct={};
	for ( in this.PArray){
		
	}
	
	return ParamStruct;
}



function StochasticOptimisationParameter(){
	this.StartValue;
	this.FractionalChange;
	this.Min;
	this.Max;
	this.CurrentValue;
	this.BestValue;
}

StochasticOptimisationParameter.prototype.Vary= function (){
	if (typeof this.CurrentValue===undefined){
		this.CurrentValue=this.StartValue;
	}
	else{
		//try to vary
		
		
		
	}
}