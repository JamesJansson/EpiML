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
}


// prototype CreateStatisticToRun

// Get error
// SimResult=


function SetupOptimisationDataExtractionObjects(){
	// this function is run both internally to the model and on the interface
	var DEO=[];//Array of OptimisationDataExtractionObject
	
	new NewDEO=new OptimisationDataExtractionObject();
	NewDEO.Name;
	
	
	
	
	
	
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of OptimisationDataExtractionObject
}

function 
// given an array of results will find the relevant 