function OptimiseFullModel(){
	
	// Set up settings
	
	
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