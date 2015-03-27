


// Duration of relationship
			// Using Dyadic Data for a Network Analysis of HIV Infection and Risk Behaviors Among Injecting Drug Users
			// Alan Neaigus, Samuel R. Friedman, Marjorie Goldstein, Gilbert Ildefonso, Richard Curtis, and Benny Jose
			// Table 4, <1 year 36% 1-5 years 29% >5 Years 35%
//OptimisePartnerChangeRate([0.36, 0.29, 0.35]);

function TestOptimisePartnerChangeRate(Input){
	return OptimisePartnerChangeRate([0.36, 0.29, 0.35]);
}




function OptimisePartnerChangeRate(ProprotionByTime){
	
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=1000;
	
	OptimisationSettings.Target=[0.36, 0.29, 0.35];
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		return DeterminePartnerDuration(ParameterSet.ProbabilityOfChange, FunctionInput.SampleSize);
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var HistogramResult=HistogramData(Results, [0, 1, 5, 100]);
		var TotalError=Sum(Pow(Minus(Target, HistogramResult.Count), 2));
		return TotalError;
	};
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		console.log("Params: "+SimulationNumber+ " P "+Mean(Parameter.ProbabilityOfChange.CurrentVec));
	};
	
	OptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	OptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 different parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	
	
	OptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("ProbabilityOfChange", 0, 1);
	OptimisationObject.Run(FunctionInput);
	
	console.log(OptimisationObject);
	
	return OptimisationObject;
	
}



function DeterminePartnerDuration(ProbabilityOfChange, SampleSize){
	// Choose people at a random time 0 to 20 years at the start
	var TimeToCheck=RandArray(0, 20, SampleSize);
	var TestedRelationshipLength=ZeroArray(SampleSize);
	var ThisRelationshipDuration;
	var TotalDurationOfPreviousRelationships;
	for (var Count in TimeToCheck){
		RelationshipFound=false
		while (RelationshipFound==false){// keep adding relationships until you reach the time
			ThisRelationshipDuration=TimeUntilEvent(ProbabilityOfChange);
			if (TotalDurationOfPreviousRelationships+ThisRelationshipDuration>TimeToCheck[Count]){
				TestedRelationshipLength[Count]=TimeToCheck[Count]-TotalDurationOfPreviousRelationships;
				RelationshipFound=true;
			}
			else{
				TotalDurationOfPreviousRelationships+=ThisRelationshipDuration;
			}
		}
	}
	return TestedRelationshipLength;
}