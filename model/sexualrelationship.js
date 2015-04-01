function SexualRelationshipAge(){//(LowerAge, UpperAge, FemaleAgeDistribution,RateOfSex, FemaleWeighting){
	// These results are calculated in the data folder
	
	var LowerAge=[15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
	var UpperAge=[18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
	var FemaleAgeDistribution=[];
	
	FemaleAgeDistribution[0]=[0,65.5,29,5.5];
	FemaleAgeDistribution[1]=[1.3,63,25.2,10.5];
	FemaleAgeDistribution[2]=[4.4,60.8,19,15.8];
	FemaleAgeDistribution[3]=[19.5,44.4,18.1,18.1];
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
	
	this.MaleLookUpTable;
}
// AA= new SexualRelationshipAge();
// AA.CreateMaleTable();

SexualRelationshipAge.prototype.CreateMaleTable = function (){
	// Create the big population of females
	
	var FemaleAgeDistributionIndex=RandSampleWeightedArray(this.FemaleWeighting, 100000)
	var FemaleAge=[];
	var MaleAge=[];
	var MaleAgeArray=[];
	var FemaleIndexArray=[];
	for (var FCount in FemaleAgeDistributionIndex){
		var FemaleIndex=FemaleAgeDistributionIndex[FCount];
		FemaleAge[FCount]=this.LowerAge[FemaleIndex]+(this.UpperAge[FemaleIndex]-this.LowerAge[FemaleIndex])*Rand.Value();
		//console.log("FCount " + FCount + " Index " + Index + " FemaleAge[FCount] " + FemaleAge[FCount]);
		MaleAge[FCount]=this.ChooseMaleAge(FemaleAge[FCount]);
		
		FlooredAge=Floor(MaleAge[FCount]);
		
		// Add the age to a sorted array by age
		if (typeof(MaleAgeArray[FlooredAge])==="undefined"){
			MaleAgeArray[FlooredAge]=[];
		}
		MaleAgeArray[FlooredAge].push(FemaleAge[FCount]);
		
		// Add the female age to the female index
		// if (typeof(FemaleIndexArray[FemaleIndex])==="undefined"){
			// FemaleIndexArray[FemaleIndex]=[];
		// }
		// FemaleIndexArray[FemaleIndex].push(MaleAge[FCount]-FemaleAge[FCount]);
	}
	// Do a histogram of the female results
	// This section is for testing of the code, and it was found that the ages were correctly generated
	// var HistResults=[];
	// var Proportion=[];
	// for (AgeIndex in FemaleIndexArray){
		// HistResults[AgeIndex]=HistogramData(FemaleIndexArray[AgeIndex], [-100, -3, 3, 6, 100]);
		// Proportion[AgeIndex]=Divide(HistResults[AgeIndex].Count, Sum(HistResults[AgeIndex].Count));
	// }
	// console.log(Proportion);
	
	
	var HistResults=[];
	var Proportion=[];
	for (AgeIndex in MaleAgeArray){
		HistResults[AgeIndex]=HistogramData(MaleAgeArray[AgeIndex], [-100, -3, 3, 6, 100]);
		Proportion[AgeIndex]=Divide(HistResults[AgeIndex].Count, Sum(HistResults[AgeIndex].Count));
	}
	
	this.MaleLookUpTable=Proportion;
	console.log(Proportion);
	// if there is no data for an age, then it returns -1
};

SexualRelationshipAge.prototype.ChooseMaleAge = function (Age){

	// Find the age group they belong to
	var AgeIndex;
	var MaleAge;
	var DiffBetweenTopAndBottomAges
	
	if (Age<this.LowerAge[0]){
		AgeIndex=0;
	}
	else if(Age>this.UpperAge[this.UpperAge.length-1]){
		AgeIndex=this.UpperAge.length-1;
	}
	else {
		var AgeIndexFound=false;
		AgeIndex=-1;
		while (AgeIndexFound==false && AgeIndex<6){ // the AdeIndex is hard limited to 6, because that is all the data we have
			AgeIndex++;
			if (this.LowerAge[AgeIndex]<=Age && Age <this.UpperAge[AgeIndex]){
				AgeIndexFound=true;
			}
		}
	}
	
	if (AgeIndexFound>6){
		AgeIndexFound=6;
	}
	
	
	// Choose the male age
	var MaleAgeIndex=RandSampleWeighted(this.FemaleAgeDistribution[AgeIndex]);
	
	//console.log("MaleAgeIndex" +MaleAgeIndex);
	
	if (MaleAgeIndex==0){// calculate from the minimum age up
		// using a linearly increasing distribution

		BaseAgeDifference=this.MinSexAge-Age;
		if (BaseAgeDifference>0){
			BaseAgeDifference=0;
		}
		
		TopAgeDifference=-3;
		
		DiffBetweenTopAndBottomAges=TopAgeDifference-BaseAgeDifference;
		if (DiffBetweenTopAndBottomAges<1){// to prevent negative values
			DiffBetweenTopAndBottomAges=1;
		}
		
		BaseAge=Age+BaseAgeDifference;
		MaleAge=BaseAge+DiffBetweenTopAndBottomAges*Sqrt(Rand.Value());// use the inversion of a linearly increasing probability distribution (3x as many in top half as bottom)
		// console.log("BaseAgeDifference" + BaseAgeDifference);
		// console.log("TopAgeDifference" + TopAgeDifference);
		// console.log("DiffBetweenTopAndBottomAges" + DiffBetweenTopAndBottomAges);
		// console.log("BaseAge" + BaseAge);
		// console.log("MaleAge" + MaleAge);
		
	}
	else if (MaleAgeIndex==3){// calculate from the max age down
		var MaxAge=Age+20;
		DiffBetweenTopAndBottomAges=20-6;
		MaleAge=MaxAge-DiffBetweenTopAndBottomAges*Sqrt(Rand.Value());// use the inversion of a linearly increasing probability distribution (3x as many in top half as bottom)
	}
	else {
		if (MaleAgeIndex==1){
			BaseAgeDifference=-3;
			TopAgeDifference=+3;
		}
		else{
			BaseAgeDifference=+3;
			TopAgeDifference=+6;
		}
		
		TopAge=Age+TopAgeDifference;
		BaseAge=Age+BaseAgeDifference;
		if (BaseAge<this.MinSexAge){
			BaseAge=this.MinSexAge;
		}
		AgeRange=TopAge-BaseAge;
		
		MaleAge=BaseAge+AgeRange*Rand.Value();
	}
	
	
	return MaleAge;
};

SexualRelationshipAge.prototype.ChooseFemaleAge = function (Age){
	if (typeof(this.MaleLookUpTable)==="undefined"){
		throw "The function .CreateMaleTable() must be run first";
	}
	
	var AgeIndex=Floor(Age);
	if (typeof(this.MaleLookUpTable[AgeIndex])==="undefined"){
	
	}

}