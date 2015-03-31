function SexualRelationshipAge(){//(LowerAge, UpperAge, FemaleAgeDistribution,RateOfSex, FemaleWeighting){
	// These results are calculated in the data folder
	
	var LowerAge=[15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
	var UpperAge=[18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
	var FemaleAgeDistribution=[];
	
	FemaleAgeDistribution[0]=[0,65.5,29,5.5];
	FemaleAgeDistribution[1]=[1.3,63,25.2,10.5];
	FemaleAgeDistribution[2]=[4.4,60.8,19,15.8];
	FemaleAgeDistribution[3]=[19.5,44.4,18.118.1];
	FemaleAgeDistribution[4]=[16.8,39.2,16,28];
	FemaleAgeDistribution[5]=[19.7,34.8,16.1,29.5];
	FemaleAgeDistribution[6]=[31.4,33.4,15.9,19.3];

	var FemaleWeighting=[541788,372479.25,1054450.5,1141267.3,1149430.95,1074097,1127928.75,992706.675,984687.6,790871.1,609201,439324.2,252538.5,149010.4,78117.3];

	var RateOfSex=[0.8,0.825,0.85,0.86,0.87,0.86,0.85,0.815,0.78,0.69,0.6,0.49,0.38,0.28,0.18];
	
	this.LowerAge=LowerAge;
	this.UpperAge=UpperAge;

	var AgeDiff=[];
	
	this.MinSexAge=14;// used for the linear decline to earlier ages.
	this.MaxOlderAge=20;
	
	this.RateOfSex=RateOfSex;
	
	// Normalise the FemaleWeighting (and indicator of the relative participation of that age in the sexual population
	
	
	this.FemaleWeighting=Divide(FemaleWeighting, Sum(FemaleWeighting));
	
	this.FemaleAgeDistribution=FemaleAgeDistribution;
	// the linear integral
	
}


SexualRelationshipAge.prototype.CreateMaleTable = function (){
	// Create the big population of females
	
		RandSampleWeightedArray(this.FemaleWeighting, 100000)
		
	
	
};

SexualRelationshipAge.prototype.ChooseMaleAge = function (Age){
	// find the age group they belong to
	var AgeIndex;
	
	if (Age<this.LowerAge[0]){
		AgeIndex=0;
	}
	else if(Age>this.UpperAge[this.UpperAge.length-1]){
		AgeIndex=this.UpperAge.length-1;
	}
	else {
		var AgeIndexFound=false;
		AgeIndex=-1;
		while (AgeIndexFound==false){
			AgeIndex++;
			if (this.LowerAge[AgeIndex]<=Age && Age <this.UpperAge[AgeIndex]){
				AgeIndexFound=true;
			}
		}
	}
	
	var MaleAgeIndex=RandSampleWeighted(this.FemaleAgeDistribution);
	
	if (MaleAgeIndex==0){// calculate from the minimum age up
		// using a linearly increasing distribution
		var DiffBetweenTopAndBottomAges=3;
		var MaleAge=this.MinSexAge+3*Sqrt(Rand.Value());
	}
	else if (MaleAgeIndex==0){// calculate from the max age down
		var MaxAge=Age+20;
		var DiffBetweenTopAndBottomAges=20;
		var MaleAge=MaxAge-20*Sqrt(Rand.Value());
		
	}
};

