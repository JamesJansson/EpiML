// This file describes the person object. It requires:
// * mortality


function  PersonObject(YearOfBirth, Sex)//, YearOfObservation Param)
{
	//Active
	this.Active=0;// status variable
	//Sex
	this.Sex=Sex;
	//Alive
	//this.Alive=1;// status variable
	this.YearOfBirth=YearOfBirth;
	this.YearOfDeath=1E9;
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

PersonObject.prototype.CurrentlyAlive = function (Year){//using prototyping for speed
	if (this.YearOfBirth<=Year && Year <= this.YearOfDeath){
		return true;
	}
	//else
	return false;
};

PersonObject.prototype.CalculateGeneralMortality= function (YearFromWhichToCalculateMortality){//, MaleMortality, FemaleMortality){
	// if this.Sex==0 && this.Aboriginal==false
	if (this.Sex==0){
		this.GeneralDeath=MaleMortality.YearOfDeath(this.YearOfBirth, YearFromWhichToCalculateMortality);
	}
	else {
		this.GeneralDeath=FemaleMortality.YearOfDeath(this.YearOfBirth, YearFromWhichToCalculateMortality);
	}
	//console.log("Birth Year Death" + this.YearOfBirth +" "+ YearFromWhichToCalculateMortality +" "+ this.GeneralDeath);
	
	// If the general death happens to be earlier than the death from other causes, set the year of death to occur first 
	if (this.GeneralDeath<this.YearOfDeath){
		this.YearOfDeath=this.GeneralDeath;
	}
	
};

PersonObject.prototype.CalculateHCVMortality= function (YearFromWhichToCalculateMortality){
	// http://jid.oxfordjournals.org/content/206/4/469.long
	
	// Determine the HCV stage
	var HCVStatus=this.HCV.Fibrosis.Get(YearFromWhichToCalculateMortality);
	HCVStageNumber=HCVStatus.Pos;
	var CurrentHCVStartTime=2;
	var NextHCVStage=2;
	var NextHCVTime=3;
	var NextHCVIndex=4;
	// Determine the time until the next HCV stage
	// Use the HCV mortality rates by stage to determine 
	
	var i=0;
	while (i){
		if (this.Sex==0){
			this.HCVDeath=HCVMaleMortality.YearOfDeath(this.YearOfBirth, CurrentHCVStage, CurrentHCVStartTime);
		}
		else {
			this.HCVDeath=HCVFemaleMortality.YearOfDeath(this.YearOfBirth, CurrentHCVStartTime);
		}
	}
	//console.log("Birth Year Death" + this.YearOfBirth +" "+ YearFromWhichToCalculateMortality +" "+ this.GeneralDeath);
	if (this.GeneralDeath<this.YearOfDeath){
		this.YearOfDeath=this.GeneralDeath;
	}
	
};

PersonObject.prototype.YearsOfLifeLost= function (){//using prototyping for speed
	// This is a general function that describes the difference between general death date and 
	// the earliest non-general death date.
	return this.GeneralDeath-Math.min(this.GeneralDeath, this.IDUDeath, this.HCVDeath, this.HIVDeath);
};




PersonObject.prototype.HCVInfection= function (YearOfInfection, Genotype, HCVParam) {
	var Alcohol=0;
	this.HCV.Infection(YearOfInfection, Genotype, this.Age(YearOfInfection), this.Sex, this.Alcohol, HCVParam );
}



	console.log("Loaded person.js");
