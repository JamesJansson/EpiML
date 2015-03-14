function OptimiseInjectionEntry(PWIDData){
// The following code needs to have run before the above function will work. 

/* 	ExtractDataFromFiles();
	MaleMortality=new MortalityCalculator(Param.MaleMortality.Rates1, Param.MaleMortality.Year1, Param.MaleMortality.Rates2, Param.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(Param.FemaleMortality.Rates1, Param.FemaleMortality.Year1, Param.FemaleMortality.Rates2, Param.FemaleMortality.Year2);
	PWIDEntryOptimisationResults=OptimiseInjectionEntry(Data.PWID); 
	
	
	
	// A=new DownloadableCSV(PWIDEntryOptimisationResults.EntryRate);
	// A=new DownloadableCSV(PWIDEntryOptimisationResults.OriginalData.Data);
	// A.Download();
	var children = PWIDEntryOptimisationResults.Results.Data.concat(PWIDEntryOptimisationResults.OriginalData.Data);
	A=new DownloadableCSV(children);
	A.Download();
	*/
	var OptimisationResults=[];
	
	// Male EntryParams
	var EntryParams={};
	EntryParams.LogMedianEntryAge=Log(21);
	EntryParams.LogSDEntryAge=0.16;
	console.error("Note the median entry age is hard set");
	
	// Do male entry
	EntryParams.SexIndex=0;
	OptimisationResults[EntryParams.SexIndex]=OptimiseInjectionEntryByGender(PWIDData, EntryParams);
	
	// Female EntryParams
	var EntryParams={};
	EntryParams.LogMedianEntryAge=Log(21);
	EntryParams.LogSDEntryAge=0.16;
	console.error("Note the median entry age is the same for female as it is for male. It is likely a couple of years earlier");
	
	// Do female entry
	EntryParams.SexIndex=1;
	OptimisationResults[EntryParams.SexIndex]=OptimiseInjectionEntryByGender(PWIDData, EntryParams);

	return OptimisationResults;
}


function OptimiseInjectionEntryByGender(PWIDData, EntryParams){
	
	var OptimisationResults={}
	var PWIDEverData={};
	PWIDEverData.Year=PWIDData.Year;
	if (EntryParams.SexIndex==0){
		PWIDEverData.Data=TransposeForCSV(PWIDData.Ever.Male); // copies in the matrix, which at time of writing is a 4 age band by 6-year matrix 
	}
	else{//==1
		PWIDEverData.Data=TransposeForCSV(PWIDData.Ever.Female); // copies in the matrix, which at time of writing is a 4 age band by 6-year matrix 
	}
	// If the number is a bit large, normalise the total down to something reasonable to optimise over
		// Find the max year group
		var MaxInYear=0;
		for (var i=0; i<PWIDEverData.Data.length; i++){
			var SumInYear=Sum(PWIDEverData.Data[i]);
			if (SumInYear>MaxInYear){MaxInYear=SumInYear;} 
		}
		// Find and multiply it by the factor associated with it
		console.log("MaxInYear: " +MaxInYear);
		var Factor=1000/MaxInYear;
		PWIDEverData.Data=Multiply(PWIDEverData.Data, Factor);

	// Perform the optimisation
	// var ReturnStructure=EntryRateOptimisation(PWIDEverData, EntryParams);
	var ReturnStructure=EntryRateOptimisationExponential(PWIDEverData, EntryParams);
	
	
	
	// Store the results for male optimisation

	OptimisationResults.OriginalData={};
	OptimisationResults.OriginalData.Year=PWIDEverData.Year;
	OptimisationResults.OriginalData.Data=PWIDEverData.Data;
	
	OptimisationResults.Results=ReturnStructure.Results;
	
	OptimisationResults.EntryRate=ReturnStructure.EntryRate;
	
	// fix up the normalisation we did earlier
	OptimisationResults.OriginalData.Data=Divide(OptimisationResults.OriginalData.Data, Factor);
	OptimisationResults.Results.Data=Divide(OptimisationResults.Results.Data, Factor);
	OptimisationResults.EntryRate.Number=Divide(OptimisationResults.EntryRate.Number, Factor);
	
	OptimisationResults.EntryParams=EntryParams;
	
	console.log("The factor used in this simulation was: "+Factor);

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
			PWIDPopulation[TotalPWID-1].IDU.StartInjecting(TimeOfStartingInjection);
		}
	}
	
	
	// Following entry, there is also a probability associated with becoming a regular user, and following that exiting at a certain probability
	
	
	return PWIDPopulation;
}




function DistributePWIDPopulationExponential(EntryParams){
	var PWIDEntryByYear=DeterminePWIDEntryRateExponential(EntryParams);
	var ReturnPopulation=[];
	if (Sum(PWIDEntryByYear.Number)>100000){
		console.log(EntryParams);
		console.log(PWIDEntryByYear);
		console.error("Warning: over 100000 people will be created (see above). This may occupy a lot of memory. Returning an empty matrix to compensate for the inability intercept excessive memory usage to model the population.");
	}
	else{
		ReturnPopulation=CreatePWIDPopulation(PWIDEntryByYear, EntryParams);
	}
	return ReturnPopulation;
}




function EntryRateOptimisationExponential(TargetForThisOptimisation, EntryParams){
	// First step is to assume increasing rates leading up to the end of the 1999 
	// due to the increased availability of heroin, followed by a slump due to 
	// reduced supply/increased prices 

	var FunctionInput={};
	FunctionInput.EntryParams=EntryParams;
	
	var EntryRateOptimisationSettings={};
	
	
	EntryRateOptimisationSettings.Function=function(FunctionInput, ParametersToOptimise){
		// Determine what is the entry rate per year from the ParametersToOptimise
		FunctionInput.EntryParams.Logk1=ParametersToOptimise.Logk1;
		FunctionInput.EntryParams.Logk2=ParametersToOptimise.Logk2;
		// Note that normalised A attempts to put a constant number of people into the years prior to the end of exponential growth period
		// This is to improve the optimisation rate of the algorithm
		FunctionInput.EntryParams.A=-ParametersToOptimise.NormalisedA*Log(ParametersToOptimise.Logk1);
		FunctionInput.EntryParams.B=ParametersToOptimise.B;

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
		var Results=[];

		
		
		for (var YearIndex=0;YearIndex<EntryParams.Year.length;YearIndex++){//for each year in which there is data
			var AgeArray=[];
			for (var PCount=0; PCount<PWIDPopulation.length; PCount++){
				var P=PWIDPopulation[PCount];//separate out to make clearer
				// Determine if the individual is currently alive and has previously  injected at that point
				if (P.Alive(EntryParams.Year[YearIndex]) && P.IDU.Use.Value(EntryParams.Year[YearIndex])>=1){
					// Determine the age at the year being optimised // Add this age to the vector of ages
					AgeArray.push(P.Age(EntryParams.Year[YearIndex]));
				}
			}
			
			
			
			
			var ThisYearsResults=HistogramData(AgeArray, [14, 20, 30, 40, 200]); 

			
			
			// store the results in the array
			Results.push(ThisYearsResults.Count);
		}
		
		return Results;
	};

	EntryRateOptimisationSettings.ErrorFunction=function(Results, Target, FunctionInput){
		if (false){
			// In this error function the error is made up of two parts:
			// 1) The error for individual ages
			var AgeError=Sum(Abs(Minus(Results, Target)));
			// 2) The error for the sum in each year
			var TotalError=0;
			for (var YearCount=0; YearCount<Target.length; YearCount++){// for each year under inspection
				TotalError+=Abs(Sum(Results[YearCount])-Sum(Target[YearCount]));
			}
			
			//return AgeError+TotalError;
			return AgeError+4*TotalError;// 1/1.98 times as much error in the sum of four normally distributed values. In this case we are assuming that the total number is twice as important to get right as any individual value
		}
		if (true){
			// In this error function the error is made up of two parts:
			// 1) The error for individual ages
			var AgeError=Sum(Divide(Abs(Minus(Results, Target)), Target));
			// 2) The error for the sum in each year
			var TotalError=0;
			for (var YearCount=0; YearCount<Target.length; YearCount++){// for each year under inspection
				TotalError+=(Abs(Sum(Results[YearCount])-Sum(Target[YearCount])))/Sum(Target[YearCount]);
			}
			
			//return AgeError+TotalError;
			return AgeError+4*TotalError;// 1/1.98 times as much error in the sum of four normally distributed values. In this case we are assuming that the total number is as important to get right as any individual value
		}
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
	FunctionInput.EntryParams.EndExponential=1995;
	FunctionInput.EntryParams.FirstYear=FunctionInput.EntryParams.Year[0]-40;// 40 years prior to the first available data
	FunctionInput.EntryParams.MaxYear=FunctionInput.EntryParams.Year[FunctionInput.EntryParams.Year.length-1];//last year of data
	console.log("Last year of data set manually");	
	
	EntryRateOptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	EntryRateOptimisationSettings.MaxIterations=100;// In this case, it will allow 10 000 different parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	EntryRateOptimisationSettings.MaxTime=20;//stop after 10 seconds
	console.error("Warning: the optimisation currently stops after just 10 seconds for debugging");
	
	
	EntryRateOptimisationSettings.Target=TargetForThisOptimisation.Data;
	
	var MaxEntryRateAtPeak=1000;// The maximum number who have previously injected is capped at 1000 above. This limit reduces the parameter space and hence time needed to run this optimisation
	
	OptimisationObject=new StochasticOptimisation(EntryRateOptimisationSettings);
	OptimisationObject.AddParameter("Logk1", 0, 1);
	OptimisationObject.AddParameter("Logk2", 0, 1);
	OptimisationObject.AddParameter("NormalisedA", 0, MaxEntryRateAtPeak);
	OptimisationObject.AddParameter("B", 0, 1);
	
	console.log(OptimisationObject);
	
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
	
			
		console.log("Results");
		console.log(Results.Data);
		console.log("Target");
		console.log(EntryRateOptimisationSettings.Target);
	
	
	
	// Here we put a pretty serious warning to inform the user if something is amiss with the optimisation
	if (SelectedParameters.NormalisedA> 0.9*MaxEntryRateAtPeak){
		console.error("The optimised result is very close to the upper bound of the optmisation ranges. This may represent that a minimum was not properly found.");
	}
	
	
	// Place the best parameters into the unchanging parameterisation 
	FunctionInput.EntryParams.Logk1=SelectedParameters.Logk1;
	FunctionInput.EntryParams.Logk2=SelectedParameters.Logk2;
	FunctionInput.EntryParams.A=SelectedParameters.A;
	FunctionInput.EntryParams.B=SelectedParameters.B;
	
	
		
	FunctionInput.EntryParams.MaxYear=2100;
	var PerYearEntryRate=DeterminePWIDEntryRateExponential(FunctionInput.EntryParams); // Rerun the algorithm to produce data that can be uses the simulation
	
	console.log("This is the unadjusted PerYearEntryRate. The highest rate was set to 2000 per year. This likely quite a bit too high.");
	console.log(PerYearEntryRate);
	
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
			NumberInYear=EntryParams.A*Exp(Log(EntryParams.Logk1)*(EntryParams.EndExponential-MidCurrentYear));
		}
		else{
			NumberInYear=EntryParams.A*EntryParams.B+EntryParams.A*(1-EntryParams.B)*Exp(Log(EntryParams.Logk2)*(MidCurrentYear-EntryParams.EndExponential));
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







// Following the assignment of the population, the main idea is to establish the following parameters
// Rate of entry into injection
// Rate of people becoming regular users
// Rate that the regular users use
// Rate of leaving regular injection 





