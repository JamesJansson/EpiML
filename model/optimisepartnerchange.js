


// Duration of relationship
			// Using Dyadic Data for a Network Analysis of HIV Infection and Risk Behaviors Among Injecting Drug Users
			// Alan Neaigus, Samuel R. Friedman, Marjorie Goldstein, Gilbert Ildefonso, Richard Curtis, and Benny Jose
			// Table 4, <1 year 36% 1-5 years 29% >5 Years 35%
//OptimisePartnerChangeRate([0.36, 0.29, 0.35]);
// The mean and also the median age were 35

function TestOptimisePartnerChangeRate(Input){
	var ProprotionByRelationshipDuration=[];
	ProprotionByRelationshipDuration[0]=Param.IDU.RelationshipDuration.Val0;
	ProprotionByRelationshipDuration[1]=Param.IDU.RelationshipDuration.Val1;
	ProprotionByRelationshipDuration[2]=Param.IDU.RelationshipDuration.Val2;
	return OptimisePartnerChangeRate(ProprotionByRelationshipDuration);//[0.36, 0.29, 0.35]
}




function OptimisePartnerChangeRate(ProprotionByRelationshipDuration){
	
	var FunctionInput={};
	var OptimisationSettings={};
	
	FunctionInput.NumberOfSamples=1000;
	
	// normalise the duration (because we are varying it in the lead into the 
	console.log(ProprotionByRelationshipDuration);
	console.log(Sum(ProprotionByRelationshipDuration));
	throw "Stopping here";
	
	OptimisationSettings.Target=Divide(ProprotionByRelationshipDuration, Sum(ProprotionByRelationshipDuration));

	
	console.log("Started");
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		return DeterminePartnerDuration(ParameterSet.PPartnerChangeYear1, ParameterSet.PPartnerChangeFollowing,FunctionInput.NumberOfSamples);
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){

		
		var TotalError=Sum(Pow(Minus(Target, Results), 2));
		console.log(TotalError);
		return TotalError;
	};
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		console.log("Params: "+SimulationNumber+ " P1 "+Mean(Parameter.PPartnerChangeYear1.CurrentVec)+ " P2 "+Mean(Parameter.PPartnerChangeFollowing.CurrentVec));
	};
	
	OptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	OptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 different parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	OptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	
	OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	OptimisationObject.AddParameter("PPartnerChangeYear1", 0, 1);
	OptimisationObject.AddParameter("PPartnerChangeFollowing", 0, 1);
	OptimisationObject.Run(FunctionInput);
	
	console.log(OptimisationObject);
	
	return OptimisationObject;
	
}



function DeterminePartnerDuration(PPartnerChangeYear1,PPartnerChangeFollowing, NumberOfSamples){
	// Choose people at a random time 0 to 20 years at the start
	var TimeToCheck=RandArray(0, 30, NumberOfSamples);
	var TestedRelationshipLength=ZeroArray(NumberOfSamples);
	var ThisRelationshipDuration;
	var TotalDurationOfPreviousRelationships;
	for (var Count in TimeToCheck){
		var RelationshipFound=false
		var NumberOfRelationships=0;
		var TotalDurationOfPreviousRelationships=0;
		while (RelationshipFound==false){// keep adding relationships until you reach the time
			NumberOfRelationships++;
			ThisRelationshipDuration=TimeUntilEvent(PPartnerChangeYear1);
			
			if (ThisRelationshipDuration>0.1){// if it gets past 1 year, then use PPartnerChangeFollowing as the probability of ending 
				ThisRelationshipDuration=0.1+TimeUntilEvent(PPartnerChangeFollowing);
			}
			// else - keep it as less than 1 year
			
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