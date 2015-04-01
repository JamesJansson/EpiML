// This file describes the person object. It requires:
// * mortality


function PersonObject(YearOfBirth, Sex)//, YearOfObservation Param)
{
	//Active
	this.Active=0;// status variable
	//Sex
	this.Sex=Sex;
	//Alive
	//this.AliveStatus=1;// status variable
	this.YearOfBirth=YearOfBirth;
	

	
	this.Death=new DeathObject(this);
	
	
	//Location (in this case, there is only one location variable, it might represent state or a local area)
	this.Location=new EventVector;

	//Alcohol
	this.Alcohol=1E9;//Date of alcoholism (increases linearly with time, probability 
	
	
	
	this.HCV = new HCVObject(this);//may need to declare this in function to reduce the size of the memory footprint
	
	this.HIV = new HIVObject();

	this.IDU = new IDUObject(this);//Injection drug use
	
	this.Haemophilia=0;
	
	this.SexualPartner=new EventVector;
	this.SexualPartnerInjects=new EventVector;
	this.SexualPartner.Set(0, this.YearOfBirth);
	this.SexualPartnerInjects.Set(0, this.YearOfBirth);
	
	//QALY 
	//this.QualityCalculation=function(time){(this.HCV, this.IDU, this.HIV, this.Age, time);}//
	//this.QALY(this.HCV, this.IDU, this.HIV, this.Age)//
	
	//Simulate general mortality
	
	
}

PersonObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};

PersonObject.prototype.Alive = function (Year){//using prototyping for speed
	if (this.YearOfBirth<=Year && Year <= this.Death.Year()){
		return true;
	}
	//else
	return false;
};

PersonObject.prototype.CalculateGeneralMortality= function (YearFromWhichToCalculateMortality, SMR){//, MaleMortality, FemaleMortality){
	// if this.Sex==0 && this.Aboriginal==false
	if (this.Sex==0){
		this.Death.General=MaleMortality.YearOfDeath(this.YearOfBirth, YearFromWhichToCalculateMortality, SMR);
	}
	else {
		this.Death.General=FemaleMortality.YearOfDeath(this.YearOfBirth, YearFromWhichToCalculateMortality, SMR);
	}
};

	




PersonObject.prototype.StartInjecting= function (Time){
	
	
	
};

// PersonObject.prototype.HCVInfection= function (YearOfInfection, Genotype, HCVParam) {
	// var Alcohol=0;
	// this.HCV.Infection(YearOfInfection, Genotype, this.Age(YearOfInfection), this.Sex, this.Alcohol, HCVParam );
// }


function DeathObject(PersonPointer){
	
	this.General=1E9;
	this.IDU=1E9;
	this.HCV=1E9;
	this.HCC=1E9;
	this.LF=1E9;
	this.HIV=1E9;
}

DeathObject.prototype.Year= function (){
	// This is a general function that describes the difference between general death date and 
	// the earliest non-general death date.
	return Math.min(this.General, this.IDU, this.HCV, this.HCC, this.LF, this.HIV);
};



DeathObject.prototype.YearsOfLifeLost= function (){
	// This is a general function that describes the difference between general death date and 
	// the earliest non-general death date.
	return this.General-Math.min(this.General, this.IDU, this.HCV, this.HCC, this.LF, this.HIV);
};





//-----------------------------------------------------------------
//
//
function IDUObject(PersonPointer){
	this.Person=PersonPointer;
	
	this.State=0;
	this.Use = new EventVector;
	this.Use.Set(0, this.Person.YearOfBirth);
	// IDU codes
	// 0: Never used
	// 1: Tried once
	// 2: Occasional user
	// 3: Regular user
	// 4: Former user
	
	this.OST = new EventVector;
	this.OST.Set(0, this.Person.YearOfBirth);
	
	this.NSP = new EventVector;
	this.NSP.Set(0, this.Person.YearOfBirth);
	
	
}

IDUObject.prototype.StartInjecting= function (Time){
	// Add the first date of injecting
	this.Use.Set(1, Time);
	
	// Add the transition to occasional user
	//if (Rand.Value()<Param.IDU.RegularInjectingProbability){
		
	//}
	
	//var TimeUntilCease=TimeUntilEvent(Param.IDU.RateOfCesssation);
	
	
	// Add the transition to regular user
	
	// Add the transition to former user
	
	// Determine excess death due to drug use
	
	this.Person.Death.IDU;
}



console.log("Loaded person.js");