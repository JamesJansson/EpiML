function HCVDataDiagnosis(Person, Notifications, Time, TimeStep){
	var ReturnData={};
	ReturnData.Time=Time;
	ReturnData.Penalty={};

	// Decide the number of diagnoses in this step
	var NumberDiagnosedThisStep=HCVDataDiagnosisNumbers(Notifications, Time, TimeStep);
	
	// Perform symptomatic diagnosis
	var DiagnosedSymptomatic=HCVSymptomaticDiagnosis(Person, Notifications, Time, TimeStep);
	ReturnData.DiagnosedSymptomatic=DiagnosedSymptomatic;
	
	// Reduce Data diagnosis by the symptomatic diagnosis numbers
	console.log(HCVDataDiagnosisNumbers);
	console.log(NumberDiagnosedThisStep.Count);
	console.log(DiagnosedSymptomatic.Count);
	
	var RemainingToBeDiagnosed=Minus(NumberDiagnosedThisStep.Count, DiagnosedSymptomatic.Count);
	
	// if it results in negative levels remaining, this results in a penalty. 
	ReturnData.Penalty.InsufficientSymptomaticDiagnoses=Apply(ReturnNegativeValues, RemainingToBeDiagnosed);
	
	// Remove negative values to continue to simulate the remaining diagnoses
	RemainingToBeDiagnosed=Apply(FilterNegativeValues, RemainingToBeDiagnosed);
	
	// Remove additional people at the specified rates in Notifications
		// Sort population into HCV undiagnosed
		// Simply add the person to a vector of undiagnosed people
		var UndiagnosedHCV=[];
		// for all people 
		for (var Pn in Person){
			// determine if unidagnosed with HCV at that point in time. 
			if (Person[Pn].HCV.UndiagnosedHCVAntibody(Time)){// note we use antibody undiagnosed because of the nature of the data: includes those who have cleared
				UndiagnosedHCV.push(Person[Pn]);
			}
		}
		// Randomise them
		var RandomisedUndiagnosedHCV=Shuffle(UndiagnosedHCV);
		
		var SumOfRemainingToBeDiagnosed=Sum(RemainingToBeDiagnosed);
		
		// Determine the testing rate of the population in this time step 
		//ReturnData.HCVAsymptomaticTestingRateForThisStep=SumOfRemainingToBeDiagnosed/RandomisedUndiagnosedHCV.length;
		
		
		// Non-symptomatic diagnoses
		ReturnData.NonsymptomaticDiagnoses=SumOfRemainingToBeDiagnosed;
		// Total undiagnosed in this step
		ReturnData.Undiagnosed=RandomisedUndiagnosedHCV.length;
		
		
		// Choose the next person in the list
		var UndiagCount=-1;
		while (UndiagCount<RandomisedUndiagnosedHCV.length && SumOfRemainingToBeDiagnosed>0){// while the people have been fully explored
			UndiagCount++;
			// determine the age and sex
			var SexIndex=RandomisedUndiagnosedHCV[UndiagCount].Sex;
			var ThisPersonAge=RandomisedUndiagnosedHCV[UndiagCount].Age(Time);
			
			// Determine which index they belong to 
			var AgeIndexFound=false;
			var AgeIndex=-1;
			while (AgeIndexFound==false && AgeIndex<Notifications.Age.length){// take into account that you have reached the end of the age array
				AgeIndex++;
				if (ThisPersonAge<Notifications.Age[AgeIndex+1]){
					AgeIndexFound=true;
				}
			}
			
			if (RemainingToBeDiagnosed[SexIndex][AgeIndex]>0){ // diagnose them if there are spaces left in the notifications
				RandomisedUndiagnosedHCV[UndiagCount].HCV.Diagnosed.Set(Time+Rand.Value()*TimeStep);// at a random time during this timestep
				
				RemainingToBeDiagnosed[SexIndex][AgeIndex]--; // reduce remaining to be diagnosed
				SumOfRemainingToBeDiagnosed--;
			}
		}
		
		// if there are people yet to be diagnosed in this step, return the penalty. Zero penalty if a-ok. 
		
		ReturnData.Penalty.InsufficientInfectedToDiagnose=RemainingToBeDiagnosed;
	
	return ReturnData;
}

function ReturnNegativeValues(Value){
	if (Value<0){
		return Value;
	}
	else {
		return 0;
	}
}

function FilterNegativeValues(Value){
	if (Value<0){
		return 0;
	}
	else {
		return Value;
	}
}


function HCVDataDiagnosisNumbers(Notifications, Time, TimeStep){
	// Choose the age and sex from the notifications table
	//Notifications.Count[SexIndex][AgeIndex][YearIndex]
	
	// Select the notification year
	var YearIndex=Notifications.Year.indexOf(Floor(Time));
	
	var NumberDiagnosedThisStep={};
	NumberDiagnosedThisStep.Age=Notifications.Age;
	NumberDiagnosedThisStep.Count=[];
	NumberDiagnosedThisStep.Count[0]=[];
	NumberDiagnosedThisStep.Count[1]=[];
	
	// copy out this into a vector that can be used later
	for (var AgeIndex=0; AgeIndex<Notifications.Age.length; AgeIndex++){
		for (var SexIndex=0; SexIndex<2; SexIndex++){
			NumberDiagnosedThisStep.Count[SexIndex][AgeIndex]=Notifications.Count[SexIndex][AgeIndex][YearIndex];
		}
	}
	// Decide the number of diagnoses in this step
	console.log(Notifications);
	console.log("Multiply: testing this line 1");
	console.log(NumberDiagnosedThisStep);
	NumberDiagnosedThisStep.Count=Multiply(NumberDiagnosedThisStep.Count, TimeStep);
	console.log("Multiply: testing this line 2");
	var FlooredResult=Floor(NumberDiagnosedThisStep.Count);
	var DiffProb=NumberDiagnosedThisStep.Count-FlooredResult;
	var Diff=Win(DiffProb);
	NumberDiagnosedThisStep.Count += Diff;// add the rand element back to the expected number to be diagnosed in this step
	
	console.error("needs testing: not sure if it works appropriately");

	return NumberDiagnosedThisStep;
}


function HCVSymptomaticDiagnosis(Person, Notifications, Time, TimeStep ){
	var StructureOfDiagnosedPeople={};
	StructureOfDiagnosedPeople.Age=Notifications.Age;
	
	var AgeList=[];
	AgeList[0]=[];
	AgeList[1]=[];
	
	for (var Pn in Person){
		var CurrentPerson=Person[Pn];
		if (CurrentPerson.Alive(Time)){
			// Determine if undiagnosed and how symptomatic they are
			if (CurrentPerson.HCV.UndiagnosedHCC() || CurrentPerson.HCV.UndiagnosedDecompensatedCirrhosis()){
				var TimeUntilDiagnosis=TimeUntilEvent(Param.HCV.SyptomaticTesting);
				if (TimeUntilDiagnosis<TimeStep){// if the testing occurs during this step
					if (Time+TimeUntilDiagnosis<CurrentPerson.Death.Year()){// Make sure that the diagnosis date is prior to death. Otherwise it is not discovered
						CurrentPerson.HCV.Diagnosis.Set(Time+TimeUntilDiagnosis);
						
						// Add the person to the numbers of people diagnosed due to symptoms
						var SexIndex=CurrentPerson.Sex;
						AgeList[SexIndex].push(CurrentPerson.Age(Time));
					}
				}
			}
		}
	}
	
	// Collect up all the results for removal from the data driven testing
	var Bins=DeepCopy(StructureOfDiagnosedPeople.Age); // 
	Bins.push(1000);
	
	StructureOfDiagnosedPeople.Count=[]
	
	var HistResult=HistogramData(AgeList[0], Bins);
	StructureOfDiagnosedPeople.Count[0]=HistResult.Count;
	HistResult=HistogramData(AgeList[1], Bins);
	StructureOfDiagnosedPeople.Count[1]=HistResult.Count;
	
	return StructureOfDiagnosedPeople;
};


function DeterminePostDataDiagnosisDataRate(DiagnosisDataArray, YearToStartAverage){// TimeArray, ArrayOfNumberUndiagnosed, ArrayOfNumberTested
	// This function determines the rate at which people are generally going to get diagnosed when they are asymptomatic
	var UndiagnosedTotal=0;
	var DiagnosedTotal=0;
	
	for (var Count in DiagnosisDataArray){
		if (DiagnosisDataArray[Count].Time>=YearToStartAverage){
			UndiagnosedTotal+=DiagnosisDataArray[Count].Undiagnosed;
			DiagnosedTotal+=DiagnosisDataArray[Count].NonsymptomaticDiagnoses;
		}
	}
	
	var PerStepProbOfDiagnosis=DiagnosedTotal/UndiagnosedTotal;
	return PerStepProbOfDiagnosis;
};

function HCVRateDiagnosis(Person, PerStepProbOfDiagnosis, Time, TimeStep){
	var ReturnData={};
	ReturnData.Penalty={};
	
	// Perform symptomatic diagnosis
	var DiagnosedSymptomatic=HCVSymptomaticDiagnosis(Person, Notifications, Time, TimeStep);
	
	ReturnData.DiagnosedSymptomatic=DiagnosedSymptomatic;
	
	// Remove additional people at the specified rates in Notifications
		// Sort population into HCV undiagnosed
		// Simply add the person to a vector of undiagnosed people
		var UndiagnosedHCV=[];
		// for all people 
		for (var Pn in Person){
			// determine if unidagnosed with HCV at that point in time. 
			if (Person[Pn].HCV.UndiagnosedHCVAntibody(Time)){// note we use antibody undiagnosed because of the nature of the data: includes those who have cleared
				UndiagnosedHCV.push(Person[Pn]);
			}
		}
		
		for (var UndiagCount in UndiagnosedHCV){
			if (Rand.Value()<PerStepProbOfDiagnosis){
				UndiagnosedHCV[UndiagCount].HCV.Diagnosed.Set(Time+Rand.Value()*TimeStep);// at a random time during this timestep
			}
		}
		
		// Non-symptomatic diagnoses
		ReturnData.NonsymptomaticDiagnoses=SumOfRemainingToBeDiagnosed;
		// Total undiagnosed in this step
		ReturnData.Undiagnosed=RandomisedUndiagnosedHCV.length;
		
	return ReturnData;
	
}


// function SelectIndex(Bounds){
	// this.Bounds=Bounds;
// }

// SelectIndex.prototype.ZeroArray= function (){
	// var ReturnArray=[];
	// for (){
	
	// }
// }

// SelectIndex.prototype.Index= function (Value){
	// if (Value< this.Bounds[0] || this.Bounds[this.Bounds.length-1]<= Value){
		// return NaN;
	// }
	
	// for (var Index=0; Index< this.Bounds.length-2; Index++){
		
	// }
// }


