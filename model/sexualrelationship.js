function SexualRelationshipAge(LowerAge, UpperAge, AgeDistribution,RateOfSex, FemaleWeighting){
	this.LowerAge=[];
	this.UpperAge=[];

	var AgeDiff=[];
	
	this.MinSexAge=14;// used for the linear decline to earlier ages.
	this.MaxOlderAge=20;
	
	
	// Normalise the FemaleWeighting
	this.FemaleWeighting=Divide(FemaleWeighting, Sum(FemaleWeighting));
	
	
	// the linear integral
	
}


SexualRelationshipAge.prototype.CreateMaleTable = function (){
	
};




