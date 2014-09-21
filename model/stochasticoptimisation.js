function  StochasticOptimisation(FunctionToRun, InputParameters)
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	this.Function={};
	this.Parameter={};
	this.Parameter
	this.SeedValue;// The seed value is used to reset the seed each time for the random number 
// start values
// start percentage change
// max/min values
// error function
// stop after x iterations/y seconds
Param[0]


// This optimisation cycles through each of the parameters individually, adjusts it a little, runs and returns the results
// Note that if there is a dependence of one on the other, this must be programmed into the function that does the optimisation

StochasticOptimisation.prototype.Run= function (){
	//Set up the simulation for the first time
	for Parameter parameter
		Parameter[Key].CurrentValue=
	
	this.Function(

}



function OptimisationParameter(){
	this.StartValue;
	this.FractionalChange;
	this.Min;
	this.Max;
	this.CurrentValue;
}

OptimisationParameter.prototype.Vary= function (){
	if (typeof this.CurrentValue===undefined){
		this.CurrentValue=this.StartValue;
	}
	else{
		//try to vary
		
		
		
	}
}