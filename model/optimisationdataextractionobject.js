// Optimisation information
// Data - type== count
// Data time (which is used for optimisation)
// Plotting time 
// Coupling with original data
// Simulated 
// Call one PWIDData, the other PWIDModel

// Extraction stage

// INside the model, it tells it how to run. 
// Outside the model, it tells it where to find the results. 


function OptimisationDataExtractionObject(){
	this.Name;
	this.GraphInterfaceID;
	this.StatisticType;
	this.ResultFunction;// ResultFunction(Population, Time), returns a vector of times
	
	this.Data;// speficified
	this.Results;
	this.DataTime;// uses the time specified in the data 
	this.GraphTime;// uses the range of times specified to show the full activity of the model
	
	this.ErrorFunction;// specifies how the error is determined. function() 
}


// prototype CreateStatistic





OptimisationDataExtractionObject.prototype.ExtractDataAndFindError=function(SimulationResult){// SimulationResult
this.SimResult=ResultFunction(SimulationResult,  this.DataTime);
var Error=this.ErrorFunction();


return Error;
};

OptimisationDataExtractionObject.prototype.ErrorFunction=function(){// SimulationResult
	// Note that this can be alterred by setting obj.Errorfunction=SomeFunction;
	var ErrorVec=Minus(this.Data, this.Result);
	var Error=Sum(ErrorVec);
	return Error;
};


OptimisationDataExtractionObject.prototype.CreateGraphData(){
	// Create names and titles 
	
	// 
	var ReturnData={};
	ReturnData.Data.StatisticType="Data";
	
	ReturnData.Result=this.ResultFunction;
	
	return ReturnData;
}


// CREATE A SUB ELEMENT THAT DOES THE OPTIMSIATION
// Results.Optimisation.Stats // the arrays match
// Results.Optimisation.Data









function SetupOptimisationDataExtractionObjects(){
	// this function is run both internally to the model and on the interface
	var DEO=[];//Array of OptimisationDataExtractionObject
	
	new NewDEO=new OptimisationDataExtractionObject();
	NewDEO.Name="EverIDU";
	this.ResultFunction=EverIDUStats;
	this.ErrorFunction=function(){
		this.Results.Count
	};
	
	
	for both sexes{
		for all ages in the 
	
	}
	
	
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of OptimisationDataExtractionObject
}

function 
// given an array of results will find the relevant 