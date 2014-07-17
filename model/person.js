function  PersonObject(YearOfBirth, Sex)//, YearOfObservation Param)
{
	//Active
	this.Active=0;
	//Sex
	this.Sex=-1;
	//Alive
	this.Alive=1;
	this.Birth=0;
	this.Death=NaN;
	this.GeneralDeath=NaN;
	this.IDUDeath=NaN;
	this.HCVDeath=NaN;
	this.HIVDeath=NaN;
	//Location
	this.Location=new EventVector;
	this.Location.Set(1, YearOfBirth);
	//Alcohol
	this.Alcohol=3E9;//Date of alcoholism (increases linearly with time, probability 
	
	
	
	this.HCV = new HCVObject(YearOfBirth);//may need to declare this in function to reduce the size of the memory footprint
	
	//this.HIV = new HCVObject();
	this.HIV={};
	this.HIV.Infected=false;
	this.HIV.Time=0;
	this.HIV.Treatment=false;
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

function Mortality(DateOfBirth, Year, Sex){
	//Linear or proportion change in mortality
	//Read in year 1
	//Read in year 2
	//Determine per year percentage change
	//Determine mortality rate for all years under consideration

	//Save into matrix Probability[Year][Age]
	//
}
