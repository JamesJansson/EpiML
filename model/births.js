function BirthRateClass(Data, YoungestAge, OldestAge, StartYear, EndYear){
	// this function takes fertility Data by age and year in the format [AgeIndex][YearIndex]
	
	this.Data=Data;
	this.YoungestAge=YoungestAge;
	this.OldestAge=OldestAge;
	this.StartYear=StartYear;
	this.EndYear=EndYear;
}

BirthRateClass.prototype.BirthOccurs=function(Age, Year, StepSize){
	if (Rand.Value()<this.Probability(Age, Year, StepSize)){
		return true;
	}
	return false;
};

BirthRateClass.prototype.Probability=function(Age, Year, StepSize){
	if (Age<this.YoungestAge){
		return 0;
	}
	if (Age>this.OldestAge){
		return 0;
	}
	if (Year<this.StartYear){
		Year=this.StartYear;
	}
	if (Year>this.EndYear){
		Year=this.EndYear;
	}
	
	// find the year index in the table
	var AgeIndex=Floor(Age-this.YoungestAge);
	var YearIndex=Floor(Year-this.StartYear);

	if (typeof(StepSize)==='undefined'){
		var StepSize=1;
	}

	return this.Data[AgeIndex][YearIndex]/StepSize;
	
};

// Testing
// Fertility=Data.Fertility;
// BirthRate=new BirthRateClass(Fertility.Data, Fertility.YoungestAge, Fertility.OldestAge, Fertility.StartYear, Fertility.EndYear);
// BirthRate.Probability(29, 1981)
// BirthRate.Probability(14, 1981)
// BirthRate.Probability(59, 1981)
// BirthRate.Probability(29, 1975)
// BirthRate.Probability(29, 1974)
// BirthRate.Probability(29, 2013)
// BirthRate.Probability(29, 2015)

// b=0;
// for (i=0; i<100000; i++){
// 	if (BirthRate.BirthOccurs(28, 2015)){
// 		b++;
// 	}
// }