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
			// try to place and interpolate the values later on
			for (var YearVecCount=0; YearVecCount<EntryParams.Year.length; YearVecCount++){
				// check that you can check
				if (YearVecCount<EntryParams.Year.length-1){//before you reach the final year
					// check for the period immediately after the exponential
					if (EntryParams.EndExponential<= MidCurrentYear && MidCurrentYear<EntryParams.Year[YearVecCount]){
						IntStartYear=EntryParams.EndExponential;
						IntStartValue=EntryParams.expA;
					}
					else{
						IntStartYear=EntryParams.Year[YearVecCount-1];
						IntStartValue=EntryParams.Estimate[YearVecCount-1];
					}
					IntEndYear=EntryParams.Year[YearVecCount];
					IntEndValue=EntryParams.Estimate[YearVecCount];
					
					// interpolate between the other points
					TimeBetweenRange=IntEndYear-IntStartYear;
					DifferenceBetweenYears=IntEndValue-IntStartValue;
					NumberInYear=(MidCurrentYear-IntStartYear)*DifferenceBetweenYears/TimeBetweenRange;
				}
				else{// if it is after the final year, use an average
					if (typeof(AverageNumber)=="undefined"){//calculate the average
						//EntryParams.NumberOfAveragingYears=3
						// The last entry should be the last with a value in the range currently
						var SumOfLastYears=0;
						for(var CountBackwards=0; CountBackwards<EntryParams.NumberOfAveragingYears; CountBackwards++){
							SumOfLastYears+=InitiatingIVDrugUse.Number[InitiatingIVDrugUse.Number-1-CountBackwards];
						}
						AverageNumber=SumOfLastYears/EntryParams.NumberOfAveragingYears;
					}//else the average is already calculated
					NumberInYear=AverageNumber;
				}
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
DistributePWIDPopulation(EntryParams, MaxYear);