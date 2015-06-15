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
	EntryParams.LogMedianEntryAge=Log(Param.IDU.InjectionStartAge.Median);
	EntryParams.LogSDEntryAge=Param.IDU.InjectionStartAge.SD;
	
	// Do male entry
	EntryParams.SexIndex=0;
	OptimisationResults[EntryParams.SexIndex]=OptimiseInjectionEntryByGender(PWIDData, EntryParams);
	
	// Female EntryParams
	var EntryParams={};
	EntryParams.LogMedianEntryAge=Log(Param.IDU.InjectionStartAge.Median);
	EntryParams.LogSDEntryAge=Param.IDU.InjectionStartAge.SD;
	
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
		//console.log("MaxInYear: " +MaxInYear);
		//var Factor=1000/MaxInYear;
		PWIDEverData.Data=Divide(PWIDEverData.Data, Settings.SampleFactor);

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
	OptimisationResults.OriginalData.Data=Multiply(OptimisationResults.OriginalData.Data, Settings.SampleFactor);
	OptimisationResults.Results.Data=Multiply(OptimisationResults.Results.Data, Settings.SampleFactor);
	OptimisationResults.EntryRate.Number=Multiply(OptimisationResults.EntryRate.Number, Settings.SampleFactor);
	
	OptimisationResults.EntryParams=EntryParams;
	

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
			
			var Sexuality=RandSampleWeighted([Param.IDU.Sexuality.Heterosexual, Param.IDU.Sexuality.Homosexual, Param.IDU.Sexuality.Bisexual], [1, 2,3]);
					
			PWIDPopulation[TotalPWID-1]=new PersonObject(YearOfBirth, EntryParams.SexIndex, Sexuality);
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
		FunctionInput.EntryParams.PeakEntryPerYear=-ParametersToOptimise.NormalisedPeakEntryPerYear*Log(ParametersToOptimise.Logk1);
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
	
	// EntryRateOptimisationSettings.ProgressFunction=function(RoundCount, Parameter, SimOutput, ErrorValues, FunctionInput){
		// // Display the results to the console for every 100 simulations
		// var ProgressString=RoundCount+": ";
		
		// var KeyCount=0, Key, MeanResult;
		// console.log(Parameter);
		// for (Key in Parameter){
			// KeyCount++;
			// ProgressString+=Key+": ";
			// MeanResult=Mean(Parameter[Key].BestVec);
			// ProgressString+=MeanResult+", ";
		// }
		// console.log(ProgressString);
	// };
	
	
	
	FunctionInput.EntryParams.Year=TargetForThisOptimisation.Year.slice();
	FunctionInput.EntryParams.YearPeakIDU=1995;
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
	OptimisationObject.AddParameter("NormalisedPeakEntryPerYear", 0, MaxEntryRateAtPeak);
	OptimisationObject.AddParameter("B", 0, 1);
	
	console.log(OptimisationObject);
	
	OptimisationObject.Run(FunctionInput);
	
	// Choose the best optimisation results
	var SelectedParameters=OptimisationObject.GetBestParameterSet();
	// Adjust the A back 
	SelectedParameters.PeakEntryPerYear=-SelectedParameters.NormalisedPeakEntryPerYear*Log(SelectedParameters.Logk1);
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
		console.log("Mean and best error by round");
		console.log(OptimisationObject.MeanError);
		console.log(OptimisationObject.BestError);

	
	
	// Here we put a pretty serious warning to inform the user if something is amiss with the optimisation
	if (SelectedParameters.NormalisedPeakEntryPerYear> 0.9*MaxEntryRateAtPeak){
		console.error("The optimised result is very close to the upper bound of the optmisation ranges. This may represent that a minimum was not properly found.");
	}
	
	
	// Place the best parameters into the unchanging parameterisation 
	FunctionInput.EntryParams.Logk1=SelectedParameters.Logk1;
	FunctionInput.EntryParams.Logk2=SelectedParameters.Logk2;
	FunctionInput.EntryParams.PeakEntryPerYear=SelectedParameters.PeakEntryPerYear;
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
		if (MidCurrentYear<EntryParams.YearPeakIDU){
			NumberInYear=EntryParams.PeakEntryPerYear*Exp(Log(EntryParams.Logk1)*(EntryParams.YearPeakIDU-MidCurrentYear));
		}
		else{
			NumberInYear=EntryParams.PeakEntryPerYear*EntryParams.B+EntryParams.PeakEntryPerYear*(1-EntryParams.B)*Exp(Log(EntryParams.Logk2)*(MidCurrentYear-EntryParams.YearPeakIDU));
		}
		
		InitiatingIVDrugUse.Number[YearCount]=NumberInYear;
	}
	
	return InitiatingIVDrugUse;
}	
		
		
function DeterminePWIDEntryRateExponential2(EntryParams, Time, TimeStep){//MaxYear is not inclusive of this year
	Time=Time+TimeStep/2;
	
	var NumberInYear, NumberInStep;
	// Determine if in the initial exponential period

	if (Time<EntryParams.YearPeakIDU){
		NumberInYear=EntryParams.PeakEntryPerYear*Exp(Log(EntryParams.Logk1)*(EntryParams.YearPeakIDU-Time));
	}
	else{
		NumberInYear=EntryParams.PeakEntryPerYear*(EntryParams.B+(1-EntryParams.B)*Exp(Log(EntryParams.Logk2)*(Time-EntryParams.YearPeakIDU)));
	}
	NumberInStep=Round(NumberInYear*TimeStep);
	
	return NumberInStep;
}	

function CreatePWID(EntryParams, Time, TimeStep){	
	var PWIDPopulation=[];
	var SexIndex, LogMedianEntryAge;
	
	var LogMedianMaleEntryAge=Log(Param.IDU.InjectionStartAge.Median);
	var LogMedianFemaleEntryAge=Log(Param.IDU.InjectionStartAge.Median-Param.IDU.InjectionStartAge.SexDifference);
	
	var LogSDEntryAge=Param.IDU.InjectionStartAge.SD;
	
	var NumberToAdd=DeterminePWIDEntryRateExponential2(EntryParams, Time, TimeStep);
	
	for (var TotalPWID=0; TotalPWID<NumberToAdd; TotalPWID++){//the total number in the group
		// Determine the sex at random
		if (Rand.Value()<Param.IDU.ProportionMale){
			SexIndex=0;
			LogMedianEntryAge=LogMedianMaleEntryAge;
		}
		else{
			SexIndex=1;
			LogMedianEntryAge=LogMedianFemaleEntryAge;
		}
		
		// Determine a random age
		var AgeAtFirstInjection=Exp(NormalRand(LogMedianEntryAge, LogSDEntryAge));// this needs to include the median and SD of the age at first injection
		// Determine a random time of starting (between Year + [0, 1) )
		var TimeOfStartingInjection=Time+TimeStep*Rand.Value();
		var YearOfBirth=TimeOfStartingInjection-AgeAtFirstInjection;
		var Sexuality=RandSampleWeighted([Param.IDU.Sexuality.Heterosexual, Param.IDU.Sexuality.Homosexual, Param.IDU.Sexuality.Bisexual], [1, 2,3]);
		PWIDPopulation[TotalPWID-1]=new PersonObject(YearOfBirth, SexIndex, Sexuality);
		PWIDPopulation[TotalPWID-1].IDU.StartInjecting(TimeOfStartingInjection);
	}

	return PWIDPopulation;
}

function SetInitialHCVLevels(Person){
	//var Time=//1993;//Param.Model.DynamicHCV.Time;
	var PWID=SelectCurrentPWID(Person, Param.Time.StartDynamicModel);
	
	console.error("The size of the extracted group is below");
	console.log(PWID);
	
	
	// Do a very rough optimisation to get the right proportion at the time
	
	// Extract injection durations
	var InjectionHistory={};
	InjectionHistory.Duration=[];
	InjectionHistory.TimeStart=[];
	for (var Pn in PWID){
		var ThisTimeStartInjection=PWID[Pn].IDU.Use.FirstTimeOf(1);	
		InjectionHistory.TimeStart.push(ThisTimeStartInjection);
		InjectionHistory.Duration.push(Param.Time.StartDynamicModel-ThisTimeStartInjection);
	}
	
	console.log("InjectionHistory.Duration");
	console.log(InjectionHistory.Duration);
	
	// Set up the optimisation
	var FunctionInput=InjectionHistory;
	var OptimisationSettings={};
	OptimisationSettings.Target=Param.HCV.InitialPrevalence;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		var TotalIDU=0;
		var TotalHCV=0;
		for (var Pn in FunctionInput.Duration){
			TotalIDU++;
			var TimeOfHCV=TimeUntilEvent(ParameterSet.AnnualPHCV);
			if (TimeOfHCV<FunctionInput.Duration[Pn]){
				TotalHCV++;
			}
		}
		var Results=TotalHCV/TotalIDU;
		return Results;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var TotalError=Abs(Results-Target);
		return TotalError;
	};

	
	//OptimisationSettings.MaxTime=10;//stop after 10 seconds
	OptimisationSettings.NumberOfSamplesPerRound=10;
	OptimisationSettings.MaxIterations=10;
	
	var HCVPOptimisation=new StochasticOptimisation(OptimisationSettings);
	HCVPOptimisation.AddParameter("AnnualPHCV", 0, 1);
	HCVPOptimisation.Run(FunctionInput);
	
	console.log(HCVPOptimisation);
	
	console.log(Mean(InjectionHistory.Duration));
	
	var AnnualPHCV=HCVPOptimisation.ParameterFinal.AnnualPHCV;
	// Now apply this to all people in the simulation thus far
	for (var Pn in PWID){
		var TimeOfHCV=TimeUntilEvent(AnnualPHCV);
		if (TimeOfHCV<InjectionHistory.Duration[Pn]){
			PWID[Pn].HCV.Infection(InjectionHistory.TimeStart[Pn]+TimeOfHCV, ChooseInitialGenotype());
		}
	}
	console.error("PWID below");
	console.log(PWID);
	
	// At this point, a plot should be created of 
		// PWID by year
		// HCV infections by year
	
	
}

function ChooseInitialGenotype(){
	// the intention of this function is to set the genotype in the proportions stated
	var Val=RandSampleWeighted([Param.HCV.GenotypePrevalence['1'], Param.HCV.GenotypePrevalence['2'], Param.HCV.GenotypePrevalence['3'], Param.HCV.GenotypePrevalence['4']], ['1', '2', '3', '4']);
	return '1';
}


// create PWID test
function TestDeterminePWIDEntryRateExponential2(){
	EntryParams=[];
	EntryParams.PeakEntryPerYear=2500;
	EntryParams.B=0.20;
	EntryParams.YearPeakIDU=1995;
	EntryParams.Logk2=0.3;
	EntryParams.Logk1=0.4;
	var TimeStep=0.1;
	for (var Time=1990; Time<2010; Time+=TimeStep){
		var Num=DeterminePWIDEntryRateExponential2(EntryParams, Time, TimeStep)
		console.log("Year " + Time + " N " + Num);
	}
}

//RunSettings2={};
//RunSettings2.FunctionName="TestDeterminePWIDEntryRateExponential2";
//SimulationHolder.Run(RunSettings2);



// optimise entry in new system
function TestCreatePWID(){
	// Globals that need to be run before code will work
	RegularInjectionTime=new RegularInjectionTimeObject();
	// OptimisedValues that need to be set by an external function
	Param.IDU.RateOfCesssation=0.25;
	var EntryParams=[];
	EntryParams.PeakEntryPerYear=2500;
	EntryParams.B=0.20;
	EntryParams.YearPeakIDU=1995;
	EntryParams.Logk2=0.3;
	EntryParams.Logk1=0.8;
	
	// 
	var Population=[];
	
	console.log("Started TestCreatePWID");

	var TimeStep=0.1;
	for (var Time=1980; Time<2010; Time+=TimeStep){
		var Num=DeterminePWIDEntryRateExponential2(EntryParams, Time, TimeStep)
		
		var PeopleToAdd=CreatePWID(EntryParams, Time, TimeStep);
		console.log("Year " + Time + " N " + PeopleToAdd.length);
		
		Population=Population.concat(PeopleToAdd);
	}
	console.log("SetInitialHCVLevels");
	// for all people, apply the exit rate
	SetInitialHCVLevels(Population);
	
	console.log("Finished TestCreatePWID");
	
	return 0;
}

//RunSettings2={};
//RunSettings2.FunctionName="TestCreatePWID";
//SimulationHolder.Run(RunSettings2);






// RunSettings2={};
// RunSettings2.FunctionName="EvalText";
// RunSettings2.Common="BBB=new RegularInjectionTimeObject();var val=[];for(var i=0; i<100000; i++){val[i]=BBB.Time()};a=HistogramData(val, [0, 7/52, 0.5, 1, 5, 10]);console.log(a);";
// SimulationHolder.Run(RunSettings2);






function TESTDeterminePWIDEntryRateExponential(){
	// Example usage
	var EntryParams={};
	EntryParams.YearPeakIDU=2000;
	EntryParams.FirstYear=1959;
	EntryParams.PeakEntryPerYear=5000;
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





