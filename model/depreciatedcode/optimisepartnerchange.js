


// Duration of relationship
			// Using Dyadic Data for a Network Analysis of HIV Infection and Risk Behaviors Among Injecting Drug Users
			// Alan Neaigus, Samuel R. Friedman, Marjorie Goldstein, Gilbert Ildefonso, Richard Curtis, and Benny Jose
			// Table 4, <1 year 36% 1-5 years 29% >5 Years 35%
//OptimisePartnerChangeRate([0.36, 0.29, 0.35]);
// The mean and also the median age were 35

function TestOptimisePartnerChangeRate(){
	var OptimisationObject=OptimisePartnerChangeRate();//[0.36, 0.29, 0.35]
	console.log(OptimisationObject);
	
	
	return 0;
}




function OptimisePartnerChangeRate(){
	var ProprotionByRelationshipDuration=[];//[0.36, 0.29, 0.35]
	ProprotionByRelationshipDuration[0]=Param.IDU.RelationshipDuration.Val0;
	ProprotionByRelationshipDuration[1]=Param.IDU.RelationshipDuration.Val1;
	ProprotionByRelationshipDuration[2]=Param.IDU.RelationshipDuration.Val2;
	
	var FunctionInput={};
	FunctionInput.NumberOfSamples=1000;
	
	var OptimisationSettings={};
	// normalise the duration (because we are varying it in the lead parameter page)
	OptimisationSettings.Target=Divide(ProprotionByRelationshipDuration, Sum(ProprotionByRelationshipDuration));

	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		return DeterminePartnerDurationProportions(ParameterSet.PPartnerChangeYear1, ParameterSet.PPartnerChangeFollowing,FunctionInput.NumberOfSamples);
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var TotalError=Sum(Pow(Minus(Target, Results), 2));
		return TotalError;
	};
	
	// OptimisationSettings.RoundProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		// console.log("Params: "+SimulationNumber+ " P1 "+Mean(Parameter.PPartnerChangeYear1.CurrentVec)+ " P2 "+Mean(Parameter.PPartnerChangeFollowing.CurrentVec));
	// };
	
	OptimisationSettings.NumberOfSamplesPerRound=10;
	OptimisationSettings.NumberOfRounds=20;// in prior testing 20 appeared to be sufficient
	OptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	var OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("PPartnerChangeYear1", 0, 1);
	OptimisationObject.AddParameter("PPartnerChangeFollowing", 0, 1);
	OptimisationObject.Run(FunctionInput);
	
	
	// Save the optimised results to Param
	// Param.PPartnerChangeYear1
	// Param.PPartnerChangeFollowing
	// 
	
	
	
	
	
	return OptimisationObject;
}



function DeterminePartnerDurationProportions(PPartnerChangeYear1,PPartnerChangeFollowing, NumberOfSamples){
	// Choose people at a random time 0 to 20 years at the start
	var TimeToCheck=RandArray(0, 20, NumberOfSamples); // this has been checked for sensitivity, and changing the value to 30 has a limited effect on the optimised result
	var TestedRelationshipLength=ZeroArray(NumberOfSamples);
	var ThisRelationshipDuration;
	var TotalDurationOfPreviousRelationships;
	for (var Count in TimeToCheck){
		var RelationshipFound=false
		var NumberOfRelationships=0;
		var TotalDurationOfPreviousRelationships=0;
		while (RelationshipFound==false){// keep adding relationships until you reach the time
			NumberOfRelationships++;
			ThisRelationshipDuration=DeterminePartnerDuration(PPartnerChangeYear1,PPartnerChangeFollowing);
			
			if (TotalDurationOfPreviousRelationships+ThisRelationshipDuration>TimeToCheck[Count]){
				TestedRelationshipLength[Count]=TimeToCheck[Count]-TotalDurationOfPreviousRelationships;
				RelationshipFound=true;
			}
			else{
				TotalDurationOfPreviousRelationships+=ThisRelationshipDuration;
			}
			if (NumberOfRelationships>100){// set a hard cut out to prevent 
				TestedRelationshipLength[Count]=ThisRelationshipDuration;// assume 
			}
		}
	}
	
	var HistogramResult=HistogramData(TestedRelationshipLength, [0, 1, 5, 100]);
	var PropResult=Divide(HistogramResult.Count, Sum(HistogramResult.Count));
	
	return PropResult;
}

function DeterminePartnerDuration(PPartnerChangeYear1,PPartnerChangeFollowing){
	var Duration=TimeUntilEvent(PPartnerChangeYear1);
	if (Duration>1){// if it gets past 1 year, then use PPartnerChangeFollowing as the probability of ending 
		Duration=1+TimeUntilEvent(PPartnerChangeFollowing);
	}
	// else - keep it as less than 1 year
	return Duration;
}