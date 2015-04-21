function HCVDataDiagnosis(Person, Notifications, Time, TimeStep){
	



	// Decide the number of diagnoses in this step
	var NumberDiagnosedThisStep=HCVDataDiagnosisNumbers(Notifications, Time, TimeStep);
	
	// Perform symptomatic diagnosis
	var NumberDiagnosedSymptomatic=HCVSymptomaticDiagnosis(Person, Notifications, Time, TimeStep );
	
	// Reduce Data diagnosis by the symptomatic diagnosis numbers
	var RemainingDiagnoses=Minus(NumberDiagnosedThisStep, NumberDiagnosedSymptomatic);
	
	// if it results in negative levels remaining, this results in a penalty
	
	
	// Remove additional people at the specified rates
		// Sort population into HCV undiagnosed
		// Simply add the person to a vector of undiagnosed people
		var UndiagnosedHCV=[];
		// for all people 
		// determine if unidagnosed with HCV at that point in time. 
		if (){
			UndiagnosedHCV.push(Person[Pn]);
		}
		
		// Randomise them
		var RandomisedUndiagnosedHCV=Shuffle(UndiagnosedHCV);
		// Choose the next person in the list
		while (Count<RandomisedUndiagnosedHCV.length && SumOfRemainingUndiagnosed>0){// while the people have been fully explored
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
		if (SumOfRemainingUndiagnosed>0){
		
		}
}






function HCVDataDiagnosisNumbers(Notifications, Time, TimeStep){
	// Select the notification year

	// Choose the age and sex from the notifications table
	
	

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
	
	console.error("needs testing: not sure if it works appropriately");

	return NumberDiagnosedThisStep;
}








function HCVSymptomaticDiagnosis(Person, Notifications, Time, TimeStep ){
	var StructureOfDiagnosedPeople=[];
	StructureOfDiagnosedPeople.Age=Notifications.Age;
	
	var AgeList=[];
	AgeList[0]=[];
	AgeList[1]=[];
	
	for (var Pn in Person){
		var CurrentPerson=Person[Pn];
		if (CurrentPerson.Alive(Year)){
			// Determine if undiagnosed and how symptomatic they are
			if (CurrentPerson.HCV.UndiagnosedHCC() || CurrentPerson.HCV.UndiagnosedDecompensatedCirrhosis()){
				var TimeUntilDiagnosis=TimeUntilEvent(Param.HCV.SyptomaticTesting);
				if (TimeUntilDiagnosis<TimeStep){
					if (Time+TimeUntilDiagnosis<CurrentPerson.Death.Year()){// Make sure that the diagnosis date is prior to death. Otherwise it is not discovered
						// Add the person to the numbers of people diagnosed due to symptoms
						var SexIndex=CurrentPerson.Sex;
						AgeList[SexIndex].push(CurrentPerson.Age(Time));
					}
				}
			}
		}
	}
	
	// Collect up all the results for removal from the data driven testing
	var Bins=DeepCopy(StructureOfDiagnosedPeople.Age)
	Bins.push(1000);
	
	var HistResult=HistogramData(AgeList[0], Bins);
	StructureOfDiagnosedPeople.Count[0]=HistResult.Count;
	HistResult=HistogramData(AgeList[1], Bins);
	StructureOfDiagnosedPeople.Count[1]=HistResult.Count;
	
	return StructureOfDiagnosedPeople;
};


function DeterminePostDataDiagnosisDataRate(Person, Notifications){

	// return PostDataDiagnosisDataRate
};

function HCVRateDiagnosis(Person, PostDataDiagnosisDataRate, Time, TimeStep){
	// Perform symptomatic diagnosis
}


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


