function HCVDataDiagnosis(Person, Data, Time, TimeStep){
	



	// Decide the number of diagnoses in this step
	var NumberDiagnosedThisStep=HCVDataDiagnosisNumbers();
	
	// Perform symptomatic diagnosis
	var NumberDiagnosedSymptomatic=SymptomaticDiagnosis(Person, Time, TimeStep );
	
	
	
	// Reduce Data diagnosis by the symptomatic diagnosis rate
	
	// if it results in negative levels remaining, this results in a penalty
	
	
	// Remove additional people at the specified rates
		// Sort population into HCV undiagnosed
		// Simply add the person to a vector of undiagnosed people
		var UndiagnosedHCV=[];
		// for all people 
		// determine if unidagnosed with HCV at that point in time. 
		
		// Create a vector of numbers 0 to name
		// Randomise them
		var RandomisedUndiagnosedHCV=Shuffle(UndiagnosedHCV);
		// Choose the next person in the list
		while (Count<RandomisedUndiagnosedHCV.length && Sum){// while the people have been fully explored
			// determine the age and sex
			var SexIndex=RandomisedUndiagnosedHCV[Count].Sex;
			var Age=RandomisedUndiagnosedHCV[Count].Age(Time);
			
			// Determine which index they belong to 
			var AgeIndexFound=false;
			while (AgeIndexFound==false){
				Data.AgeBounds[].Upper
				Data.AgeBounds[].Lower
			}
			
			// if there are people who need to be diagnosed in that list 
			// diagnose them if there are spaces left in the 
			// reduce the number to be diagnosed in that list 
			
			// else keep going
		}
		
		// if there are people yet to be diagnosed in this step, return the penalty. Zero penalty if a-ok. 
		
	
}






function HCVDataDiagnosisNumbers(Data, Time, TimeStep){
	// Select the notification year

	// Choose the age and sex from the notifications table
	// For each of the sexes
	var Notifications={}; // This should go into the outer loop
	Notifications.Year=Data.MaleNotifications.Year;
	Notifications.Age=Data.MaleNotifications.Age;
	Notifications.Table=[];
	Notifications.Table[0]=[];
	Notifications.Table[0]=Data.MaleNotifications.Table;
	Notifications.Table[1]=[];
	Notifications.Table[1]=Data.FemaleNotifications.Table;
	

	//Notifications.Table[SexIndex][AgeIndex][YearIndex]
	var YearIndex=Notifications.Year.indexOf(Floor(Time));
	
	var NumberDiagnosedThisStep={};
	NumberDiagnosedThisStep.Age=Notifications.Age;
	NumberDiagnosedThisStep.Count=[];
	NumberDiagnosedThisStep.Count[0]=[];
	NumberDiagnosedThisStep.Count[1]=[];
	
	
	// copy out this into a vector that can be used later
	for (var AgeIndex=0; AgeIndex<Notifications.Age.length; AgeIndex++){
		for (var SexIndex=0; SexIndex<2; SexIndex++){
			NumberDiagnosedThisStep.Count[SexIndex][AgeIndex]=Notifications.Table[SexIndex][AgeIndex][YearIndex];
		}
	}
	// Decide the number of diagnoses in this step
	NumberDiagnosedThisStep.Count=Multiply(NumberDiagnosedThisStep.Count, TimeStep);
	var FlooredResult=Floor(NumberDiagnosedThisStep.Count);
	var DiffProb=NumberDiagnosedThisStep.Count-FlooredResult;
	var Diff=Win(DiffProb);
	NumberDiagnosedThisStep.Count += Diff;// add the rand element back to the expected number to be diagnosed in this step
	
	console.error("needs testing");

	return NumberDiagnosedThisStep;
}






function HCVRateDiagnosis(Person, PostDataDiagnosisDataRate, Time, TimeStep){
	// Perform symptomatic diagnosis
}

function SymptomaticDiagnosis(Person, Time, TimeStep ){
	for (var Pn in Person){
		if (Person.Alive(Year)){
			// Determine if undiagnosed and how symptomatic they are
			if (Person.HCV.UndiagnosedHCC() || Person.HCV.UndiagnosedDecompensatedCirrhosis()){
			
			
				// Make sure that the diagnosis date is prior to death. Otherwise it is not discovered
				Person.Death.Year();
			}
			// Add the person to the numbers of people diagnosed due to symptoms
			
			
			
		}
		
		// 
		// 
	}
	return StructureOfDiagnosedPeople;
};


function DeterminePostDataDiagnosisDataRate(Person, Data){

};




function SelectIndex(Bounds){
	this.Bounds=Bounds;
}

SelectIndex.prototype.ZeroArray= function (){
	var ReturnArray=[];
	for (){
	
	}
}

SelectIndex.prototype.Index= function (Value){
	if (Value< this.Bounds[0] || this.Bounds[this.Bounds.length-1]<= Value){
		return NaN;
	}
	
	for (var Index=0; Index< this.Bounds.length-2; Index++){
		
	}
}


