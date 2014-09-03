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
	// The mortality rate is take in as a per year mortality, starting
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

