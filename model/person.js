// This file describes the person object. It requires:
// * mortality


function  PersonObject(YearOfBirth, Sex)//, YearOfObservation Param)
{
	//Active
	this.Active=0;// status variable
	//Sex
	this.Sex=-1;
	//Alive
	this.Alive=1;// status variable
	this.Birth=0;
	this.Death=1E9;
	this.GeneralDeath=1E9;
	this.IDUDeath=1E9;
	this.HCVDeath=1E9;
	this.HIVDeath=1E9;
	//Location (in this case, there is only one location variable, it might represent state or a local area)
	this.Location=new EventVector;

	//Alcohol
	this.Alcohol=3E9;//Date of alcoholism (increases linearly with time, probability 
	
	
	
	this.HCV = new HCVObject(YearOfBirth);//may need to declare this in function to reduce the size of the memory footprint
	
	this.HIV = new HIVObject();
	//this.IDU
	this.IDU={};
	
	//QALY 
	//this.QualityCalculation=function(time){(this.HCV, this.IDU, this.HIV, this.Age, time);}//
	//this.QALY(this.HCV, this.IDU, this.HIV, this.Age)//
	
	//Simulate general mortality
	
	
}

PersonObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};

PersonObject.prototype.YearsOfLifeLost= function (){//using prototyping for speed
	// This is a general function that describes the difference between general death date and 
	// the earliest described death date.
	return this.GeneralDeath-Math.min(this.GeneralDeath, this.IDUDeath, this.HCVDeath, this.HIVDeath);
};

// Text output of the individual
// 0: born
// 

function Mortality(DateOfBirth, Year, Sex){
	//Linear or proportion change in mortality
	//Australia
	//http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/3302.0.55.0012010%E2%80%932012?OpenDocument 
	//Aboriginal
	//http://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/3302.0.55.0032010-2012?OpenDocument 
	//Read in year 1
	//Read in year 2
	//Determine per year percentage change
	//Determine mortality rate for all years under consideration

	//Save into matrix Probability[Year][Age]
	//IndexYearRef=
	//MaxYearRef=sizeofthematrix
	
	
	//.Date(DateOfBirth, Year)
	// Work out year
	// YearRef=Year-IndexYearRef;
	// if (YearRef<0){YearRef=0;}
	// perform a cumulative mortality calculation
	// RandVal=Rand()
	// for 
	
	
	// Disease stage probability of testing
	// 
}

PersonObject.prototype.HCVInfection= function (YearOfInfection, Genotype, HCVParam) {
	this.HCV.Infection(YearOfInfection, Genotype, this.Age(YearOfInfection), this.Sex, Alcohol, HCVParam );
}
