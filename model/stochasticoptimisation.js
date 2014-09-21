function  StochasticOptimisation(){
// Returns the parameterisation that has been optimised in the format that it was handed to the original function
	this.Function;
	this.Parameter=[];
	
	this.CurrentParameterArray=[];
	this.CurrentParameter={};
	
	this.SeedValue;// The seed value is used to reset the seed each time for the random number 
	
	this.Update;// this is a function that is run at the end of each round to, for example.
// start values
// start percentage change
// max/min values
// error function
// stop after x iterations/y seconds

	this.Help='formats for structure\n Function(OptimisedParam) \n Update(TrialNumber, Error)';
}
StochasticOptimisation.prototype.AddParameter=function(P){
	var A=new OptimisationParameter;
	A[P.Name]=
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