function OptimiseByGender(PWIDData){
// The following code needs to have run before the above function will work. 

/* 	ExtractDataFromFiles();
	MaleMortality=new MortalityCalculator(Param.MaleMortality.Rates1, Param.MaleMortality.Year1, Param.MaleMortality.Rates2, Param.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(Param.FemaleMortality.Rates1, Param.FemaleMortality.Year1, Param.FemaleMortality.Rates2, Param.FemaleMortality.Year2);
	PWIDEntryOptimisationResults=OptimiseByGender(Data.PWID); 
	A=new DownloadableCSV(PWIDEntryOptimisationResults.Male.EntryRate);
	A.Download();
	*/
	
	var OptimisationResults={}
	
	// Do male EntryParams
	var EntryParams={};
	EntryParams.SexIndex=0;
	EntryParams.LogMedianEntryAge=Log(21);
	EntryParams.LogSDEntryAge=0.16;
	console.log("Note the median entry age is hard set");
	
	//EntryParams.TotalPWID=0;//Probably unnecessary
	
	
	var MalePWIDEverData={};
	MalePWIDEverData.Year=PWIDData.Year;
	MalePWIDEverData.Data=TransposeForCSV(PWIDData.Ever.Male); // copies in the matrix, which at time of writing is a 4 age band by 6-year matrix 
	
	// If the number is a bit large, normalise the total down to something reasonable to optimise over
		// Find the max year group
		var MaxInYear=0;
		for (var i=0; i<MalePWIDEverData.Data.length; i++){
			var SumInYear=Sum(MalePWIDEverData.Data[i]);
			if (SumInYear>MaxInYear){MaxInYear=SumInYear;} 
		}
		// Find and multiply it by the factor associated with it
		var Factor=10000/MaxInYear;
		MalePWIDEverData.Data=Multiply(MalePWIDEverData.Data, Factor);

	// Perform the optimisation
	var ReturnStructure=EntryRateOptimisation(MalePWIDEverData, EntryParams);
	
	// Store the results for male optimisation
	OptimisationResults.Male={};

	OptimisationResults.Male.OriginalData={};
	OptimisationResults.Male.OriginalData.Year=MalePWIDEverData.Year;
	OptimisationResults.Male.OriginalData.Data=MalePWIDEverData.Data;
	
	OptimisationResults.Male.Results=ReturnStructure.Results;
	
	OptimisationResults.Male.EntryRate=ReturnStructure.EntryRate;
	
	OptimisationResults.Male.Parameters=ReturnStructure.Parameters;
	
	// fix up the normalisation we did earlier
	OptimisationResults.Male.OriginalData.Data=Divide(OptimisationResults.Male.OriginalData.Data, Factor);
	OptimisationResults.Male.Results.Data=Divide(OptimisationResults.Male.Results.Data, Factor);
	OptimisationResults.Male.EntryRate.Number=Divide(OptimisationResults.Male.EntryRate.Number, Factor);
	
	OptimisationResults.Male.EntryParams=EntryParams;
	

	// The results will be structured as follows
	// Male
		// EntryRate
			// Year
			// Number
		// OptimisationParameters
			// epxk
			// expA
			// Estimate
		// OriginalData
		// Results
			
			
	
	
	
	// Do female EntryParams
	// Target 
	
	// This function returns the entry rate by year
	
	
	return OptimisationResults;
}









function EntryRateOptimisation(TargetForThisOptimisation, EntryParams){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	// this is a multi-stage optimisation that requires the optimisation of the first data points followed by subsequent ones.
	// First step is to model the increase in the number of people starting drug use in the lead up to 1998
	// From that point on, we adjust the entry rate every 3 years (with interpolation)
	
	// Start off with all parameters set to zero
	var FunctionInput={};
	FunctionInput.EntryParams=EntryParams;
	
	var EntryRateOptimisationSettings={};
	
	// FunctionInput.EntryParams=FunctionInput.PWID;
	
	
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		if (FunctionInput.OptimiseExponential==true){
			FunctionInput.EntryParams.explogk=ParametersToOptimise.explogk;
			// Note that normalised A attempts to put a constant number of people into the years prior to the end of exponential growth period
			// This is to improve the optimisation rate of the algorithm
			FunctionInput.EntryParams.expA=-ParametersToOptimise.NormalisedA*Log(ParametersToOptimise.explogk);
			//FunctionInput.EntryParams.expA=ParametersToOptimise.expA;
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
		

		FunctionInput.EntryParams.MaxYear=FunctionInput.YearBeingOptimised;
		var PWIDPopulation=DistributePWIDPopulation(FunctionInput.EntryParams);//Returns PWIDPopulation as defined to the MaxYear

		// Determine the general population death 
		for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
			var P=PWIDPopulation[PCount];//separate out to make clearer
			P.CalculateGeneralMortality(P.IDU.Use.Time[1]);// Perform mortality calculations from the date of first using injection drugs
		}
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
		
		
		
		
		
		// Count the distribution at the given date to determine the numbers in specific groups
		var AgeArray=[];
		for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
			var P=PWIDPopulation[PCount];//separate out to make clearer
			// Determine if the individual is currently alive and has previously  injected at that point
			if (P.Alive(FunctionInput.YearBeingOptimised) && P.IDU.Use.Value(FunctionInput.YearBeingOptimised)>=1){
				// Determine the age at the year being optimised // Add this age to the vector of ages
				AgeArray.push(P.Age(FunctionInput.YearBeingOptimised));
			}
		}

		
		var Results=HistogramData(AgeArray, [14, 20, 30, 40, 200]); 
		

		
	
		//console.log(ParametersToOptimise);
		//console.log(ParametersToOptimise.Y);
		//var Results=NormalRandArray(ParametersToOptimise.X, ParametersToOptimise.Y, FunctionInput.NumberOfSamples);
		return Results.Count;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
		// In this error function the error is made up of two parts:
		// 1) The error for individual ages
		// 2) The error for the sum in that year
		
		var TotalError=Sum(Abs(Minus(Results, Target)))+Abs(Sum(Results)-Sum(Target));
		
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
			MeanResult=Mean(Parameter[Key].BestVec);
			ProgressString+=MeanResult+", ";
		}
		console.log(ProgressString);
	};
	
	EntryRateOptimisationSettings.MaxTime=1;//stop after 1000 seconds
	
	// Initialise all of the values to zero
	FunctionInput.EntryParams.Year=TargetForThisOptimisation.Year.slice();
	FunctionInput.EntryParams.Year.splice(0, 1); // remove the first element
	FunctionInput.EntryParams.explogk=1;//log1=0;
	FunctionInput.EntryParams.expA=0;
	FunctionInput.EntryParams.Estimate=ZeroArray(FunctionInput.EntryParams.Year.length);
	// We can set the years to optimise to whatever we want, but the first attempt will be to optimise it to each of the years in the survey 
	//FunctionInput.EntryParams.Year=[1999, 2012];
	FunctionInput.EntryParams.EndExponential=TargetForThisOptimisation.Year[0];
	FunctionInput.EntryParams.FirstYear=FunctionInput.EntryParams.Year[0]-40;// 40 years prior to the first available data
	FunctionInput.EntryParams.NumberOfAveragingYears=5;
	
	
	// For the exponential 
	FunctionInput.OptimiseExponential=true;
	// Do the first range that increases up to 1998
	FunctionInput.YearBeingOptimised=FunctionInput.EntryParams.EndExponential;// First year of data
	FunctionInput.PositionForYearBeingOptimised=0;
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=100;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 dfferent parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data[FunctionInput.PositionForYearBeingOptimised];
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("explogk", 0, 1);
	OptimisationObject.AddParameter("NormalisedA", 0, 10000);
	OptimisationObject.Run(FunctionInput);
	
	// Choose the best optimisation results
	var SelectedParameters=OptimisationObject.GetBestParameterSet();
	// Adjust the expA back 
	SelectedParameters.expA=-SelectedParameters.NormalisedA*Log(SelectedParameters.explogk);
	// Here we put a pretty serious warning to inform the user if something is amiss with the optimisation
	if (SelectedParameters.NormalisedA> 0.9*10000){
		console.error("The optimised result is very close to the upper bound of the optmisation ranges. This may represent that a minimum was not properly found.");
	}
	
	
	// Place the best parameters into the unchanging parameterisation 
	FunctionInput.EntryParams.explogk=SelectedParameters.explogk;
	FunctionInput.EntryParams.expA=SelectedParameters.expA;
	
	// Save the Optimisation results so that it can be graphed later
	var Results={};
	Results.Year=[];
	Results.Data=[];
	Results.Year[0]=TargetForThisOptimisation.Year[0];
	Results.Data[0]=OptimisationObject.GetBestResults();
	
	

	
	// For each of the subsequent years
	FunctionInput.OptimiseExponential=false;
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 dfferent parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	for (var OptimisationCount=0; OptimisationCount<FunctionInput.EntryParams.Year.length; OptimisationCount++){
		FunctionInput.PositionForYearBeingOptimised=OptimisationCount;
		EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data[FunctionInput.PositionForYearBeingOptimised+1];
		FunctionInput.YearBeingOptimised=FunctionInput.EntryParams.Year[OptimisationCount];
		OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
		OptimisationObject.AddParameter("Estimate", 0, 10000);
		OptimisationObject.Run(FunctionInput);
		// Select and save best parameter fit
		SelectedParameters=OptimisationObject.GetBestParameterSet();
		FunctionInput.EntryParams.Estimate[OptimisationCount]=SelectedParameters.Estimate;
		// Select and save best results
		Results.Data[OptimisationCount+1]=OptimisationObject.GetBestResults();
		Results.Year[0]=TargetForThisOptimisation.Year[0];
		
		// Here we put a pretty serious warning to inform the user if something is amiss with the optimisation
		if (SelectedParameters.Estimate> 0.9*10000){
			console.error("The optimised result is very close to the upper bound of the optmisation ranges. This may represent that a minimum was not properly found.");
		}
	}
	
	
	// An alterntive optimisation function
	// A, expk, (finish 1999) and a result for 2010
	
	
	
	
	
	FunctionInput.EntryParams.MaxYear=2100;
	var PerYearEntryRate=DeterminePWIDEntryRate(FunctionInput.EntryParams); // Rerun the algorithm to produce data that can be uses the simulation
	var ReturnStructure={};
	ReturnStructure.EntryRate=PerYearEntryRate;
	ReturnStructure.Target=TargetForThisOptimisation;
	ReturnStructure.Results=Results;
	return ReturnStructure;// Return the object that contains the optimisation information

}


function DistributePWIDPopulation(EntryParams){
	var PWIDEntryByYear=DeterminePWIDEntryRate(EntryParams);
	if (Sum(PWIDEntryByYear.Number)>100000){
		console.log("Warning: over 100000 people will be created. This may occupy a lot of memory");
		throw "Stopping before it breaks";
	}
	return CreatePWIDPopulation(PWIDEntryByYear, EntryParams);
}

	
function CreatePWIDPopulation(PWIDEntryByYear, EntryParams){	
	
	var PWIDPopulation=[];
	
	var TotalPWID=0;
	var LogMedianEntryAge=EntryParams.LogMedianEntryAge;
	var LogSDEntryAge=EntryParams.LogSDEntryAge;
	
	
	for (var YearIndex=0; YearIndex<PWIDEntryByYear.Year.length; YearIndex++){
		var CurrentYear=PWIDEntryByYear.Year[YearIndex];
		for (var CountThisYear=0; CountThisYear<Round(PWIDEntryByYear.Number[YearIndex]); CountThisYear++){//the total number in the group
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


function DeterminePWIDEntryRate(EntryParams){//MaxYear is not inclusive of this year
	var InitiatingIVDrugUse={};
	InitiatingIVDrugUse.Year=[];
	InitiatingIVDrugUse.Number=[];
	
	var MaxYearValue=Round(EntryParams.MaxYear);
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
			NumberInYear=EntryParams.expA*Exp(Log(EntryParams.explogk)*(EntryParams.EndExponential-MidCurrentYear));
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








function EntryRateOptimisationExponential(TargetForThisOptimisation, EntryParams){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	// this is a multi-stage optimisation that requires the optimisation of the first data points followed by subsequent ones.
	// First step is to model the increase in the number of people starting drug use in the lead up to 1998
	// From that point on, we adjust the entry rate every 3 years (with interpolation)
	
	// Start off with all parameters set to zero
	var FunctionInput={};
	FunctionInput.EntryParams=EntryParams;
	
	var EntryRateOptimisationSettings={};
	
	// FunctionInput.EntryParams=FunctionInput.PWID;
	
	
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		FunctionInput.EntryParams.Logk=ParametersToOptimise.Logk1;
		FunctionInput.EntryParams.Logk=ParametersToOptimise.Logk2;
		// Note that normalised A attempts to put a constant number of people into the years prior to the end of exponential growth period
		// This is to improve the optimisation rate of the algorithm
		FunctionInput.EntryParams.A=-ParametersToOptimise.NormalisedA*Log(ParametersToOptimise.Logk1);
		FunctionInput.EntryParams.B=-ParametersToOptimise.B;

		var PWIDPopulation=DistributePWIDPopulationExponential(FunctionInput.EntryParams);//Returns PWIDPopulation as defined to the MaxYear

		// Determine the general population death 
		for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
			var P=PWIDPopulation[PCount];//separate out to make clearer
			P.CalculateGeneralMortality(P.IDU.Use.Time[1]);// Perform mortality calculations from the date of first using injection drugs
		}

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
		
		
		// Count the distribution at the given date to determine the numbers in specific groups
		var Results={};
		Results.Count=[];
		
		for (var YearIndex=0;YearIndex<YearArrayToBePassed;YearIndex++){//for each year in which there is data
			var AgeArray=[];
			for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
				var P=PWIDPopulation[PCount];//separate out to make clearer
				// Determine if the individual is currently alive and has previously  injected at that point
				if (P.Alive(FunctionInput.YearBeingOptimised) && P.IDU.Use.Value(FunctionInput.YearBeingOptimised)>=1){
					// Determine the age at the year being optimised // Add this age to the vector of ages
					AgeArray.push(P.Age(FunctionInput.YearBeingOptimised));
				}
			}
			var ThisYearsResults=HistogramData(AgeArray, [14, 20, 30, 40, 200]); 
			// store the results in the array
			Results.Count.push(ThisYearsResults.Count);
		}
		
		return Results.Count;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
		// In this error function the error is made up of two parts:
		// 1) The error for individual ages
		var AgeError=Sum(Abs(Minus(Results, Target)));
		// 2) The error for the sum in each year
		var TotalError=0;
		for (var YearCount=0; YearCount<Target.Length; YearCount++){// for each year under inspection
			TotalError+=Abs(Sum(Results[YearCount])-Sum(Target[YearCount]));
		}
		return TotalError+AgeError;
	};
	
	EntryRateOptimisationSettings.ProgressFunction=function(RoundCount, Parameter, SimResults, ErrorValues, FunctionInput){
		// Display the results to the console for every 100 simulations
		var ProgressString=RoundCount+": ";
		
		var KeyCount=0, Key, MeanResult;
		console.log(Parameter);
		for (Key in Parameter){
			KeyCount++;
			ProgressString+=Key+": ";
			MeanResult=Mean(Parameter[Key].BestVec);
			ProgressString+=MeanResult+", ";
		}
		console.log(ProgressString);
	};
	
	
	
	FunctionInput.EntryParams.Year=TargetForThisOptimisation.Year.slice();
	FunctionInput.EntryParams.EndExponential=2000;
	FunctionInput.EntryParams.FirstYear=FunctionInput.EntryParams.Year[0]-40;// 40 years prior to the first available data
	FunctionInput.EntryParams.MaxYear=2010;//last year of data
	console.log("Last year of data set manually");	
	
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=100;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 dfferent parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	EntryRateOptimisationSettings.MaxTime=1000;//stop after 1000 seconds
	
	EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data;
	
	var MaxEntryRateIn2000=20000;
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("Logk1", 0, 1);
	OptimisationObject.AddParameter("Logk2", 0, 1);
	OptimisationObject.AddParameter("NormalisedA", 0, MaxEntryRateIn2000);
	OptimisationObject.AddParameter("B", 0, 1);
	
	OptimisationObject.Run(FunctionInput);
	
	// Choose the best optimisation results
	var SelectedParameters=OptimisationObject.GetBestParameterSet();
	// Adjust the A back 
	SelectedParameters.A=-SelectedParameters.NormalisedA*Log(SelectedParameters.Logk1);
	// Save the Optimisation results so that it can be graphed later
	var Results={};
	Results.Year=[];
	Results.Data=[];
	Results.Year=TargetForThisOptimisation.Year;
	Results.Data=OptimisationObject.GetBestResults();
	
	
	
	
	
	// Here we put a pretty serious warning to inform the user if something is amiss with the optimisation
	if (SelectedParameters.NormalisedA> 0.9*MaxEntryRateIn2000){
		console.error("The optimised result is very close to the upper bound of the optmisation ranges. This may represent that a minimum was not properly found.");
	}
	
	
	// Place the best parameters into the unchanging parameterisation 
	FunctionInput.EntryParams.Logk1=SelectedParameters.Logk1;
	FunctionInput.EntryParams.Logk2=SelectedParameters.Logk2;
	FunctionInput.EntryParams.A=SelectedParameters.A;
	FunctionInput.EntryParams.B=SelectedParameters.B;
	
	
	
	

	
	
	
	
	
	
	FunctionInput.EntryParams.MaxYear=2100;
	var PerYearEntryRate=DeterminePWIDEntryRate(FunctionInput.EntryParams); // Rerun the algorithm to produce data that can be uses the simulation
	var ReturnStructure={};
	ReturnStructure.EntryRate=PerYearEntryRate;
	ReturnStructure.Target=TargetForThisOptimisation;
	ReturnStructure.Results=Results;
	return ReturnStructure;// Return the object that contains the optimisation information

}





function DeterminePWIDEntryRateExponential(EntryParams){//MaxYear is not inclusive of this year
	var InitiatingIVDrugUse={};
	InitiatingIVDrugUse.Year=[];
	InitiatingIVDrugUse.Number=[];
	
	var MaxYearValue=Round(EntryParams.MaxYear);
	var MidCurrentYear, NumberInYear;
	var IntStartYear, IntStartValue, IntEndYear, IntEndValue, TimeBetweenRange, DifferenceBetweenYears, AverageNumber;
	var YearCount=-1;
	for (var CurrentYear=EntryParams.FirstYear; CurrentYear<MaxYearValue; CurrentYear++){
		YearCount++;
		MidCurrentYear=CurrentYear+0.5;// Add half a year (to get the rough average over the year)
		
		InitiatingIVDrugUse.Year[YearCount]=CurrentYear;//Add the year label
		
		// Determine if in the initial exponential period
		if (MidCurrentYear<EntryParams.EndExponential){
			// Determine the exponential value
			NumberInYear=EntryParams.A*Exp(Log(EntryParams.Logk1)*(EntryParams.EndExponential-MidCurrentYear));
		}
		else{
			NumberInYear=EntryParams.A*EntryParams.B+EntryParams.A*(1-EntryParams.B)*Exp(Log(EntryParams.Logk2)*(MidCurrentYear-EntryParams.EndExponential));
			console.log(NumberInYear);
			console.log(EntryParams);
		}
		
		InitiatingIVDrugUse.Number[YearCount]=NumberInYear;
	}
	
	
	return InitiatingIVDrugUse;
}	
		
		
		




function TESTDeterminePWIDEntryRateExponential(){
	// Example usage
	var EntryParams={};
	EntryParams.EndExponential=2000;
	EntryParams.FirstYear=1959;
	EntryParams.A=5000;
	EntryParams.Logk1=0.8;
	EntryParams.Logk2=0.9;
	EntryParams.B=0.6;
	
	EntryParams.MaxYear=2100;
	EntryParams.SexIndex=0;
	EntryParams.LogMedianEntryAge=Log(21);
	EntryParams.LogSDEntryAge=0.16;
	
	
	var DistributePWIDPopulationResults=DeterminePWIDEntryRateExponential(EntryParams);
	
	var DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<DistributePWIDPopulationResults.Number.length; i++){
		DistributePWIDPopulationText+=DistributePWIDPopulationResults.Number[i]+"\n";
	}
	console.log(DistributePWIDPopulationText);

	
	
/* 	// here make the relevant person class individuals,  
	var PersonArrayStorage=CreatePWIDPopulation(DistributePWIDPopulationResults, EntryParams);// To create PersonObects
	console.log(PersonArrayStorage.length);
	DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<=1000; i++){
		DistributePWIDPopulationText+=(PersonArrayStorage[i].IDU.Use.Time[1]-PersonArrayStorage[i].IDU.Use.Time[0])+"\n";
	}
	console.log(DistributePWIDPopulationText); */
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
	EntryParams.MaxYear=2020;
	EntryParams.SexIndex=0;
	EntryParams.LogMedianEntryAge=Log(21);
	EntryParams.LogSDEntryAge=0.16;
	
	
	var DistributePWIDPopulationResults=DeterminePWIDEntryRate(EntryParams);
	
	var DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<=60; i++){
		DistributePWIDPopulationText+=DistributePWIDPopulationResults.Number[i]+"\n";
	}
	console.log(DistributePWIDPopulationText);

	
	
	// here make the relevant person class individuals,  
	var PersonArrayStorage=CreatePWIDPopulation(DistributePWIDPopulationResults, EntryParams);// To create PersonObects
	console.log(PersonArrayStorage.length);
	DistributePWIDPopulationText="";//Used to copy the output
	for (var i=0; i<=1000; i++){
		DistributePWIDPopulationText+=(PersonArrayStorage[i].IDU.Use.Time[1]-PersonArrayStorage[i].IDU.Use.Time[0])+"\n";
	}
	console.log(DistributePWIDPopulationText);
}



// Following the assignment of the population, the main idea is to establish the following parameters
// Rate of entry into injection
// Rate of people becoming regular users
// Rate that the regular users use
// Rate of leaving regular injection 
