// This object provides a way of storing mortality rates and calculating the date of death of individuals under observation
// In the simulation, there should be 4 objects that represent mortality, namely
// Male general
// Female general
// Male Indigenous
// Female Indigenous
// This function requires the use of mathtools.js to:
// * calculate the time until an event
// * perform a matrix division and addition


// In this case, mortality is adjusted per year by determining the fractional 


// It provides 4 modes of operation:
// Returning a yearly probability of mortality given the year of inspection, and the year of birth
// Returning the year (e.g. 2016.2) of mortality (if mortality occurs) over a period (e.g. 0.1 of a year)
// Returning the year (e.g. 2016.2) of mortality until the end of life
// Returning the year (e.g. 2016.2) of mortality until the end of life given a flat standardised mortality ratio
// Returning the year (e.g. 2016.2) of mortality until the end of life given a vector of standardised mortality ratios by age
// 

function MortalityCalculator(MortalityProbabilityArray1, Year1, MortalityProbabilityArray2, Year2){
	// The mortality rate is take in as a per year mortality, starting with the first entry [0] being the death rate in the first year of life (0 years old)
	// The last mortality probability is the same rate for all subsequent years
	// e.g. is the data only goes to 90 years, 91, 92 etc will use the 90 year old rate of mortality
	
	// error checking
	if (MortalityProbabilityArray1.length != MortalityProbabilityArray2.length){
		console.error("Mortality probability arrays should be the same length");
	}
	if (Year1<=Year2){
		console.error("Year 2 should be bigger than year 1");
	}
	
	this.BaselineP=MortalityProbabilityArray2;
	this.BaselineYear=Year2;
	this.YearlyImprovement=[];
	
	var TimeDiff=Year2 - Year1;
	var ImprovementFraction;
	for (YearIndex=0; YearIndex<MortalityProbabilityArray1.length; YearIndex++){
		ImprovementFraction = Divide(MortalityProbabilityArray2, MortalityProbabilityArray1);
		this.YearlyImprovement[YearIndex]=Math.pow(ImprovementFraction, 1/TimeDiff);
		if (this.YearlyImprovement[YearIndex]>1){// Normalise, we don't want increasing mortality with time
			this.YearlyImprovement[YearIndex]=1;
		}
	}
}

PersonObject.prototype.YearOfDeath= function(YearOfBirth, Year){
	// This function determines the year of death of someone 


	//Australia
	//http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/3302.0.55.0012010%E2%80%932012?OpenDocument 
	//Aboriginal
	//http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/3302.0.55.0032010-2012?OpenDocument 

	// Determine age of person
	var StartingAge=Year-YearOfBirth;
	var CurrentAgeIndex=Math.floor(StartingAge);
	var YearsSinceBaseline=(Year-this.BaselineYear);// note that this value is allowed to be both fractional and negative
	var YearsSinceStartYear=Year;
	
	var TimeRemainingInThisAge=StartingAge-CurrentAgeIndex;
	
	var AdjustedProbabilityOfDeath;
	var TimeInThisAge;
	
	
	AdjustedProbabilityOfDeath=this.BaselineP[CurrentAgeIndex] * Math.pow(this.YearlyImprovement, YearsSinceBaseline);
	AdjustedProbabilityOfDeath=AdjustedProbabilityOfDeath*TimeRemainingInThisAge;
	if (AdjustedProbabilityOfDeath<Rand.Value()){
		// Determine the time at which mortality occurs
		TimeInThisAge=TimeRemainingInThisAge*Rand.Value();
		YearsSinceStartYear=YearsSinceStartYear+TimeInThisAge;
		return YearsSinceStartYear;
	}
	// If the person does not die in the remaining time at age e.g. 42, add what remains of the year
	YearsSinceStartYear=YearsSinceStartYear+TimeRemainingInThisAge;
	
	var YearOfDeathDetermined=false;
	while (YearOfDeathDetermined==false){
		if (CurrentAgeIndex<this.BaselineP.length){
			CurrentAgeIndex++;
		}
		YearsSinceBaseline++;
		// Adjust the mortality rate to account for improvements in mortality with time
		AdjustedProbabilityOfDeath=this.BaselineP[CurrentAgeIndex] * Math.pow(this.YearlyImprovement, YearsSinceBaseline);
		if (AdjustedProbabilityOfDeath<Rand.Value()){
			YearOfDeathDetermined=true;
			TimeInThisAge=Rand.Value();
			YearsSinceStartYear=YearsSinceStartYear+TimeInThisAge;
			return YearsSinceStartYear;
		}
		// If person does not die in the year, add a year to 
		
	}
	
	
	
	
	
	
	
	// Note that year adjustment was planned to be rounded, but there isn't a huge trade off in terms of calculation speed.
	// According to the code below, rounding results in very little change between rounding the year
	// RandomNumbers=Rand.Array(1000000);
	// function Exponentiate(Arr, Exp){
		// var Arr1=Arr.slice();
		// var TimerStart = new Date().getTime() / 1000;
		// for (key in Arr1){// For each element in the array
			// Arr1[key]=Math.pow(Arr1[key], Exp);
		// }
		// var TimerFinish = new Date().getTime() / 1000;
		// var TotalTime=TimerFinish -TimerStart;
		// console.log(TotalTime);
		// return Arr1;
	// }
	// A=Exponentiate(RandomNumbers, 5);
	// A=Exponentiate(RandomNumbers, 5.2);
	
	
	
	



	//IndexYearRef=
	//MaxYearRef=sizeofthematrix
	
	
	//.Date(DateOfBirth, Year)
	// Work out year
	// YearRef=Year-IndexYearRef;
	// if (YearRef<0){YearRef=0;}
	// perform a cumulative mortality calculation
	// RandVal=Rand()
	// for 
	
	

};