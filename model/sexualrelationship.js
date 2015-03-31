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


function RandSampleWeighted(Weights, Values){
	// Normalised weights
	var Total=Sum(Weights);
	var NormalisedWeights=Divide(Weights, Total);
	
	var Count=0;
	var ChosenValue=Rand.Value();
	var SelectedIndex=0;
	var ValueFound=false;
	while (ValueFound==false){
		Count+=Weights[SelectedIndex];
		if (Count>ChosenValue){
			ValueFound=true;
		}
		else {
			SelectedIndex++;
		}
	}
	
	if (typeof(Values)==="undefined"){
		return SelectedIndex;
	}
	else{	
		if (Weights.length!=Values.length){
			throw "The length of the weights and Values should be equal";
		}
		return Values[SelectedIndex];
	}
}