function HCVDataDiagnosis(Person, Notifications, Time, TimeStep){
	var ReturnData={};
	ReturnData.Time=Time;
	ReturnData.Penalty={};

	// Decide the number of diagnoses in this step
	var NumberDiagnosedThisStep=HCVDataDiagnosisNumbers(Notifications, Time, TimeStep);
	
	// Perform symptomatic diagnosis
	var DiagnosedSymptomatic=HCVSymptomaticDiagnosis(Person, Notifications.Age, Time, TimeStep);
	ReturnData.DiagnosedSymptomatic=DiagnosedSymptomatic;
	
	// Reduce Data diagnosis by the symptomatic diagnosis numbers

	
	var RemainingToBeDiagnosed=Minus(NumberDiagnosedThisStep.Count, DiagnosedSymptomatic.Count);
	
	
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
		var UndiagCount=0;
		while (UndiagCount<RandomisedUndiagnosedHCV.length && SumOfRemainingToBeDiagnosed>0){// while the people have been fully explored
			
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
				RandomisedUndiagnosedHCV[UndiagCount].HCV.Diagnose(Time+Rand.Value()*TimeStep);// at a random time during this timestep
				
				RemainingToBeDiagnosed[SexIndex][AgeIndex]--; // reduce remaining to be diagnosed
				SumOfRemainingToBeDiagnosed--;
			}
			
			UndiagCount++;
		}
		
		// if there are people yet to be diagnosed in this step, return the penalty. Zero penalty if a-ok. 
		
		ReturnData.Penalty.InsufficientInfectedToDiagnose=RemainingToBeDiagnosed;
	
	return ReturnData;
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
			
			// Decide the number of diagnoses in this step
			var DataNotificationsThisStep=Notifications.Count[SexIndex][AgeIndex][YearIndex];
			NumberDiagnosedThisStep.Count[SexIndex][AgeIndex]=DataNotificationsThisStep*TimeStep/Settings.SampleFactor;
		}
	}
	


	var FlooredResult=Floor(NumberDiagnosedThisStep.Count);
	var DiffProb=Minus(NumberDiagnosedThisStep.Count, FlooredResult);
	var Diff=Win(DiffProb);
	
	Diff=Apply(Number, Diff);
	

	
	
	NumberDiagnosedThisStep.Count=Add(FlooredResult, Diff);// add the rand element back to the expected number to be diagnosed in this step
	


	return NumberDiagnosedThisStep;
}


function HCVSymptomaticDiagnosis(Person, AgeStructureArray, Time, TimeStep ){
	var StructureOfDiagnosedPeople={};
	StructureOfDiagnosedPeople.Age=DeepCopy(AgeStructureArray);
	
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
						CurrentPerson.HCV.Diagnose(Time+TimeUntilDiagnosis);
						
						// Add the person to the numbers of people diagnosed due to symptoms
						var SexIndex=CurrentPerson.Sex;
						AgeList[SexIndex].push(CurrentPerson.Age(Time));
				
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

function HCVRateDiagnosis(Person, AgeStructureArray, PerStepProbOfDiagnosis, Time, TimeStep){
	var ReturnData={};
	ReturnData.Penalty={};
	
	// Perform symptomatic diagnosis
	var DiagnosedSymptomatic=HCVSymptomaticDiagnosis(Person, AgeStructureArray, Time, TimeStep);
	
	ReturnData.DiagnosedSymptomatic=DiagnosedSymptomatic;
	
	// For all people who are undiagnosed, yet are infected, diagnose them at the 
	var UndiagnosedHCV=[];
	// for all people 
	for (var Pn in Person){
		// determine if unidagnosed with HCV at that point in time. 
		if (Person[Pn].HCV.UndiagnosedHCVAntibody(Time)){// note we use antibody undiagnosed because of the nature of the data: includes those who have cleared
			UndiagnosedHCV.push(Person[Pn]);
			
			// determine at the specified probability whether the person will be diagnosed or not
			if (Rand.Value()<PerStepProbOfDiagnosis){
				Person[Pn].HCV.Diagnose(Time+Rand.Value()*TimeStep);
			}
		}
	}

//	ReturnData.NonsymptomaticDiagnoses
	
	

		
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


