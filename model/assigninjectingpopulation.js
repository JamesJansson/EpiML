function SplitByGender(PWIDData){
	//ExtractDataFromFiles();
	// SplitByGender(Data.PWID);
	var MalePWIDEverData={};
	var PerYearEntryRate={}
	MalePWIDEverData.Year=PWIDData.Year;
	
	// Do male EntryParams
	MalePWIDEverData.Data=TransposeForCSV(PWIDData.Ever.Male); // copies in the matrix, which at time of writing is a 4 age band by 6-year matrix 
	PerYearEntryRate.Male=EntryRateOptimisation(MalePWIDEverData);
	
	
	
	
	// Do female EntryParams
	// Target 
	
	// This function returns the entry rate by year
}




function EntryRateOptimisation(TargetForThisOptimisation){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	// this is a multi-stage optimisation that requires the optimisation of the first data points followed by subsequent ones.
	// First step is to model the increase in the number of people starting drug use in the lead up to 1998
	// From that point on, we adjust the entry rate every 3 years (with interpolation)
	
	// Start off with all parameters set to zero
	var FunctionInput={};
	FunctionInput.EntryParams={};
	
	
	var EntryRateOptimisationSettings={};
	
	// FunctionInput.EntryParams=FunctionInput.PWID;
	
	
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		if (FunctionInput.OptimiseExponential==true){
			FunctionInput.EntryParams.explogk=ParametersToOptimise.explogk;
			// Note that normalised A attempts to put a constant number of people into the years prior to the end of exponential growth period
			// This is to improve the optimisation rate of the algorithm
			// FunctionInput.EntryParams.expA=ParametersToOptimise.NormalisedA;
			FunctionInput.EntryParams.expA=ParametersToOptimise.expA;
			
			console.log(FunctionInput.EntryParams);
		}
		else{
			FunctionInput.EntryParams.Estimate[FunctionInput.PositionForYearBeingOptimised]=ParametersToOptimise.Estimate;
		}
		
		
		// FunctionInput.EntryParams.Year
		// FunctionInput.EntryParams.Estimate 
		
		// FunctionInput.EntryParams.EndExponential=1999;// Beginning of 1998
		// FunctionInput.EntryParams.FirstYear=1958;// Beginning of 1958 (40 years earlier) is the earliest we consider injection drug use
		// FunctionInput.EntryParams.MedianEntryAge = 21; (from 
		// FunctionInput.EntryParams.MedianEntryAgeLogSD = 0.XXXXX; (from 
		// 
		
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUncertaintySD=0.1;// a value that gives variation in the result due to the small numbers
		
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimate=1.2;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateLowerRange=1.0;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateUpperRange=1.4;
		
		
		var PWIDPopulation=DistributePWIDPopulation(FunctionInput.EntryParams, FunctionInput.YearBeingOptimised);//Returns PWIDPopulation as defined to the MaxYear
	
		// Determine drug related mortality - use Australian cause of death statistics
		// page 71 of the 2001 social trends will be good enough for this
		// http://www.ausstats.abs.gov.au/ausstats/subscriber.nsf/0/6AB30EFAC93E3F5CCA256A630006EA93/$File/41020_2001.pdf
		// http://www.abs.gov.au/AUSSTATS/abs@.nsf/2f762f95845417aeca25706c00834efa/a96b3196035d56c0ca2570ec000c46e5!OpenDocument 
		// 1737 in 1999, 72% were male in 1999
		// 734 in 1979, 49% were male in 1979
		// Interpolate for periods in between
		// 
		// This gives drug-induced death rates by age groups in years 2000 to 2012
		// "4125.0 Gender Indicators, Australia, August 2014"
		// http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/4125.0August%202014?OpenDocument 
		// Multiplying this out by the age groups should give the right number of deaths
		
		
		// Optimise staying and leaving rate for this period
		
		
		console.log(PWIDPopulation);
		
		// Count the distribution at the given date to determine the numbers in specific groups
		var AgeArray=[];
		for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
			P=PWIDPopulation[PCount];//separate out to make clearer
			// Determine if the individual is currently alive and has previously  injected at that point
			if (P.Alive(FunctionInput.YearBeingOptimised) && P.IDU.Get(FunctionInput.YearBeingOptimised)>=1){
				// Determine the age at the year being optimised // Add this age to the vector of ages
				AgeArray.push(P.Age(FunctionInput.YearBeingOptimised));
			}
		}
		console.log("age array");
		console.log(AgeArray);
		
		Results=HistogramData([AgeArray], [14, 20, 30, 40, 200]); 
		
	
		//console.log(ParametersToOptimise);
		//console.log(ParametersToOptimise.Y);
		//var Results=NormalRandArray(ParametersToOptimise.X, ParametersToOptimise.Y, FunctionInput.NumberOfSamples);
		return Results.Count;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
	
			
		//var CurrentHistogramsResults=HistogramData(Results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		console.log("The results and target are:");
		console.log(Results);
		console.log(Target);
		
		var TotalError=Sum(Abs(Minus(Results, Target)));
		
		return TotalError;
	};
	
	EntryRateOptimisationSettings.ProgressFunction=function(RoundCount, Parameter, SimResults, ErrorValues, FunctionInput){
		// Display the results to the console for every 100 simulations
		var ProgressString=RoundCount+": ";
		
		var KeyCount=0, Key, MeanResult;
		console.log(Parameter);
		for (Key in Parameter){
			KeyCount++;
			ProgressString+=Key+": ";
			MeanResult=Mean(Parameter[Key]);
			ProgressString+=MeanResult+", ";
		}
		console.log(ProgressString);
	};
	
	EntryRateOptimisationSettings.MaxTime=1;//stop after 1000 seconds
	
	// Initialise all of the values to zero
	FunctionInput.EntryParams.Year=TargetForThisOptimisation.Year;
	FunctionInput.EntryParams.explogk=1;//log1=0;
	FunctionInput.EntryParams.expA=0;
	FunctionInput.EntryParams.Estimate=ZeroArray(FunctionInput.EntryParams.Year.length);
	// We can set the years to optimise to whatever we want, but the first attempt will be to optimise it to each of the years in the survey 
	//FunctionInput.EntryParams.Year=[1999, 2012];
	FunctionInput.EntryParams.EndExponential=FunctionInput.EntryParams.Year[0];
	FunctionInput.EntryParams.FirstYear=FunctionInput.EntryParams.Year[0]-40;// 40 years prior to the first available data
	
	// For the exponential 
	FunctionInput.OptimiseExponential=true;
	// Do the first range that increases up to 1998
	FunctionInput.PositionForYearBeingOptimised=0;
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 dfferent parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data[FunctionInput.PositionForYearBeingOptimised];
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("explogk", 0, 1);
	OptimisationObject.AddParameter("expA", 0, 100000);
	OptimisationObject.Run(FunctionInput);
	
	// For each of the subsequent years
	FunctionInput.OptimiseExponential=false;
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 dfferent parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	for (var OptimisationCount=1; OptimisationCount<FunctionInput.Estimate; OptimisationCount++){
		FunctionInput.PositionForYearBeingOptimised=OptimisationCount;
		EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data[FunctionInput.PositionForYearBeingOptimised];
		OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
		OptimisationObject.AddParameter("Estimate", 0, 100000);
		OptimisationObject.Run(FunctionInput);
	}
	
	
	return OptimisationObject;// what is this? Should return the full results

}


function DistributePWIDPopulation(EntryParams, MaxYear){
	var PWIDEntryByYear=DeterminePWIDEntryRate(EntryParams, MaxYear);
	var PWIDPopulation=[];
	
	var TotalPWID=0;
	var LogMedianEntryAge=Log(21);
	var LogSDEntryAge=0.16;
	console.log("Note the median entry age is hard set");
	
	for (var YearIndex=0; YearIndex<PWIDEntryByYear.Year.length; YearIndex++){
		var CurrentYear=PWIDEntryByYear.Year[YearIndex];
		for (var CountThisYear=0; CountThisYear<PWIDEntryByYear.Number[YearIndex]; CountThisYear++){//the total number in the group
			TotalPWID++;
			// Determine a random age
			var AgeAtFirstInjection=Exp(NormalRand(LogMedianEntryAge, LogSDEntryAge));// this needs to include the median and SD of the age at first injection
			// Determine a random time of starting (between Year + [0, 1) )
			var TimeOfStartingInjection=CurrentYear+Rand.Value();
			var YearOfBirth=TimeOfStartingInjection-AgeAtFirstInjection;
			PWIDPopulation[TotalPWID-1]=new PersonObject(YearOfBirth, EntryParams.SexIndex);
			PWIDPopulation[TotalPWID-1].StartInjecting(TimeOfStartingInjection);
			
		}
	}
	return PWIDPopulation;
}


function DeterminePWIDEntryRate(EntryParams, MaxYear){//MaxYear is not inclusive of this year
	var InitiatingIVDrugUse={};
	InitiatingIVDrugUse.Year=[];
	InitiatingIVDrugUse.Number=[];
	
	var MaxYearValue=Round(MaxYear);
	var MidCurrentYear, NumberInYear;
	var IntStartYear, IntStartValue, IntEndYear, IntEndValue, TimeBetweenRange, DifferenceBetweenYears, AverageNumber;
	var YearCount=-1;
	for (var CurrentYear=EntryParams.FirstYear; CurrentYear<MaxYearValue; CurrentYear++){
		YearCount++;
		MidCurrentYear=CurrentYear+0.5;// Add half a year (to get the rough average over the year)
		
		InitiatingIVDrugUse.Year[YearCount]=CurrentYear;//Add the year label
		
		// Determine if in the exponential period
		if (MidCurrentYear<EntryParams.EndExponential){
			// Determine the exponential value
			NumberInYear=EntryParams.expA*Math.exp(Math.log(EntryParams.explogk)*(EntryParams.EndExponential-MidCurrentYear));
		}
		else{
			var UseAverage=false;
			if (EntryParams.Year.length<0){
				UseAverage=true;
			}
			// if it is before the final year where there is an estimate
			if (MidCurrentYear<EntryParams.Year[EntryParams.Year.length-1]){
				var KeepChecking=true;
				// try to place and interpolate the values later on
				for (var YearVecCount=0; YearVecCount<EntryParams.Year.length && KeepChecking; YearVecCount++){

					// check for the period immediately after the exponential
					if (YearVecCount==0 && EntryParams.EndExponential<= MidCurrentYear && MidCurrentYear<EntryParams.Year[YearVecCount]){
						IntStartYear=EntryParams.EndExponential;
						IntStartValue=EntryParams.expA;
					}
					else{
						IntStartYear=EntryParams.Year[YearVecCount-1];
						IntStartValue=EntryParams.Estimate[YearVecCount-1];
					}
					IntEndYear=EntryParams.Year[YearVecCount];
					IntEndValue=EntryParams.Estimate[YearVecCount];
					
					// Check that it is actually between those years, if so stop
					if (IntStartYear<=MidCurrentYear && MidCurrentYear< IntEndYear){
						KeepChecking=false
					}
				}	
				// interpolate between the other points
				TimeBetweenRange=IntEndYear-IntStartYear;
				DifferenceBetweenYears=IntEndValue-IntStartValue;
				NumberInYear=IntStartValue+(MidCurrentYear-IntStartYear)*DifferenceBetweenYears/TimeBetweenRange;
			}
			else{
				UseAverage=true;
			}
			
			if (UseAverage){// if it is after the final year, use an average
				if (typeof(AverageNumber)=="undefined"){//calculate the average
					//EntryParams.NumberOfAveragingYears=3
					// The last entry should be the last with a value in the range currently
					var SumOfLastYears=0;
					for(var CountBackwards=0; CountBackwards<EntryParams.NumberOfAveragingYears; CountBackwards++){
						SumOfLastYears+=InitiatingIVDrugUse.Number[InitiatingIVDrugUse.Number.length-1-CountBackwards];
					}
					AverageNumber=SumOfLastYears/EntryParams.NumberOfAveragingYears;
				}//else the average is already calculated
				NumberInYear=AverageNumber;
			}
			
			
		}
		InitiatingIVDrugUse.Number[YearCount]=NumberInYear;
	}
	return InitiatingIVDrugUse;
}

function TESTDeterminePWIDEntryRate(){
	// Example usage
	var EntryParams={};
	EntryParams.EndExponential=1999;
	EntryParams.FirstYear=1959;
	EntryParams.expA=2000;
	EntryParams.explogk=0.8;
	EntryParams.Year=[2002, 2005, 2012];
	EntryParams.Estimate=[1500, 1400, 2300];// note the estimate here is instantaneous
	EntryParams.NumberOfAveragingYears=4;
	var MaxYear=2020;

	var DistributePWIDPopulationResults=DeterminePWIDEntryRate(EntryParams, MaxYear);
	
	var DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<=60; i++){
		DistributePWIDPopulationText+=DistributePWIDPopulationResults.Number[i]+"\n";
	}
	//console.log(DistributePWIDPopulationText);

	// here make the relevant person class individuals,  
	var PersonArrayStorage=DistributePWIDPopulation(EntryParams, MaxYear);// To create PersonObects
	DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<=1000; i++){
		DistributePWIDPopulationText+=(PersonArrayStorage[i].IDU.Use.Time[1]-PersonArrayStorage[i].IDU.Use.Time[0])+"\n";
	}
	//console.log(DistributePWIDPopulationText);
}



// Following the assignment of the population, the main idea is to establish the following parameters
// Rate of entry into injection
// Rate of people becoming regular users
// Rate that the regular users use
// Rate of leaving regular injection 
