function EntryRateOptimisation(){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	// this is a multistage optimisation that requires the optimisation of the first data points followed by subsequent ones.
	// First step is to model the increase in the number of people starting drug use in the lead up to 1998
	// From that point on, we adjust the entry rate every 3 years (with interpolation)
	
	// Start off with all parameters set to zero
	var FunctionInput={};
	var EntryRateOptimisationSettings={};
	
	//FunctionInput.NumberOfSamples=1000;
	
	// FunctionInput.EntryParams=FunctionInput.PWID;
	
	// Do the first range that increases up to 1998
	EntryRateOptimisationSettings.Target=Data.PWID;
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		FunctionInput.EntryParams.explogk=ParametersToOptimise.explogk;
		FunctionInput.EntryParams.expA=ParametersToOptimise.expA;
		
		// FunctionInput.EntryParams.Year
		// FunctionInput.EntryParams.Estimate (.push to append the latest estimate)
		
		// FunctionInput.EntryParams.EndExponential=1999;// Beginning of 1998
		// FunctionInput.EntryParams.FirstYear=1958;// Beginning of 1958 (40 years earlier) is the earliest we consider injection drug use
		// FunctionInput.EntryParams.MedianEntryAge = 21; (from 
		// FunctionInput.EntryParams.MedianEntryAgeLogSD = 0.XXXXX; (from 
		// 
		
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUncertaintySD=0.1;// a value that gives variation in the result due to the small numbers
		
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimate=1.2;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateLowerRange=1.0;
		// FunctionInput.EntryParams.AIHWHouseholdSurveryUnderstimateUpperRange=1.4;
		
		
		// PWIDPopulation=DistributePWIDPopulation(FunctionInput.EntryParams, FunctionInput.MaxYear);//Returns PWIDPopulation as defined to the MaxYear
	
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
		
		var Results={};
		Results.PWIDPopulation=PWIDPopulation;
	
		//console.log(ParametersToOptimise);
		//console.log(ParametersToOptimise.Y);
		//var Results=NormalRandArray(ParametersToOptimise.X, ParametersToOptimise.Y, FunctionInput.NumberOfSamples);
		return Results;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
		// Look at Results.People
		// Count the distribution at given dates
			// Use the CountStatistic to determine the numbers in specific groups
		var Value=new CountStatistic();
			
			
		var CurrentHistogramsResults=HistogramData(Results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		var TotalError=Sum(Abs(Minus(CurrentHistogramsResults.Count, Target)));
		return TotalError;
	};
	
	// EntryRateOptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimResults, ErrorValues){
		// console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
		// PSetCount=0;
		// Data=[];
		// for (var key in Parameter.X.CurrentVec){
			// Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
			// PSetCount++;
		// }
		
		// PlotSomething={};
		// PlotSomething.Data=Data;
		// PlotSomething.Code="FixedAxisScatterPlot('#PlotHolder', Data,  'AAA', 'BBB', 0, 10, 0, 10);";
		// self.postMessage({Execute: PlotSomething});
		
		
		// ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
	// };
	
	EntryRateOptimisationSettings.MaxTime=10;//stop after 10 seconds
	
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("explogk", 0, 1);
	OptimisationObject.AddParameter("expA", 0, 100000);
	OptimisationObject.Run(FunctionInput);
	
	
	return OptimisationObject;

}





function DistributePWIDPopulation(EntryParams, MaxYear){//MaxYear is not inclusive of this year
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
// Example usage
EntryParams={};
EntryParams.EndExponential=1999;
EntryParams.FirstYear=1959;
EntryParams.expA=20000;
EntryParams.explogk=0.8;
EntryParams.Year=[2002, 2005, 2012];
EntryParams.Estimate=[15000, 14000, 23000];// note the estimate here is instantaneous
EntryParams.NumberOfAveragingYears=4;
MaxYear=2020;
DistributePWIDPopulationResults=DistributePWIDPopulation(EntryParams, MaxYear);

DistributePWIDPopulationText="";//Used to copy the output
for (i=0; i<=60; i++){
DistributePWIDPopulationText+=DistributePWIDPopulationResults.Number[i]+"\n";
}

// Following the assignment of the population, the main idea is to establish the following parameters
// Rate of entry into injection
// Rate of people becoming regular users
// Rate that the regular users use
// Rate of leaving regular injection 
