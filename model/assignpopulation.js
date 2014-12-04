function AssignPopulation(Data, SampleFactor){
	var PNotification=[];// an array that stores the notifications
	var PCount=0; // Number of people currently added to the notification file
	var NumAgeGroups=Data.MaleNotifications.Age.length;
	var AgeVector=Data.MaleNotifications.Age;//This +5 is the range
	
	console.log("Warning: duplicate rate reset here.");
	var DuplicateFactor=0;// maybe a per year by age probability, 
	
	var StateVector;
	var TotalInStateThisYear;
	var EstimateInThisGroup, EstimateInThisGroup1, EstimateInThisGroup2, InThisGroup;

	// Choose the age and sex from the notifications table
	// For each of the sexes
	var Sex=[];
	Sex[0]={};
	Sex[0].Notifications={};
	Sex[0].Notifications=Data.MaleNotifications.Table;
	Sex[1]={};
	Sex[1].Notifications={};
	Sex[1].Notifications=Data.FemaleNotifications.Table;
	
	console.log("Assigning diagnoses");

	// For each year
	for (var YearIndex=0; YearIndex<Data.StateNotifications.Year.length; YearIndex++){
		YearThisStep=Data.StateNotifications.Year[YearIndex];
		
		StateVector=[];//reset
		TotalInStateThisYear=0;
		for (var StateIndex=0; StateIndex<Data.StateNotifications.State.length; StateIndex++){
			
			// Scale down state notifications (by both the SampleFactor and the DuplicateFactor
			// OR maybe don't bother, just create the vector, shuffle then let the scale down of age/sex notifications take care of it
	
			// Create a vector of notifications by state, e.g. [0, 1, 7, 3, ...] that can be sampled sequentially 
			for (var CountInThisState=0; CountInThisState<Data.StateNotifications.Table[StateIndex][YearIndex]; CountInThisState++){
				StateVector[TotalInStateThisYear]=Data.StateNotifications.State[StateIndex];
				TotalInStateThisYear=TotalInStateThisYear+1;
			}
		}
		StateVector=Shuffle(StateVector);
		
		// Later: for each state create a vector of 
		// Aboriginality [0, 0, 1, 1, 0, 0...]
		// HIV coinfection
		
		// Alcoholism
		
		// For each age group
		for (var AgeIndex=0; AgeIndex<NumAgeGroups; AgeIndex++){
			for (var SexIndex=0; SexIndex<2; SexIndex++){
				
				EstimateInThisGroup=Sex[SexIndex].Notifications[AgeIndex][YearIndex];
				//Compensating for using a representative sample
				//note that Math.round() will not give the full picture (groups with <0.5 people will always have less, and groups with >0.5 will always have more than they should
				//To compensate, the algorithm adds a person with a probability based on the remainder
				// e.g. and entry with 3.4 people will give 3 people plus one extra person with 40% probability 
				EstimateInThisGroup=EstimateInThisGroup*(1-DuplicateFactor)/SampleFactor;
				EstimateInThisGroup1=Math.floor(EstimateInThisGroup);
				EstimateInThisGroup2=EstimateInThisGroup-EstimateInThisGroup1;// Some value between 0 and 1
				InThisGroup=EstimateInThisGroup1+Win(EstimateInThisGroup2);
				
				for (var CountInThisGroup=0; CountInThisGroup<InThisGroup; CountInThisGroup++){
					YearOfDiagnosis=YearThisStep+Rand.Value();
					AgeAtDiagnosis=AgeVector[AgeIndex]+5*Rand.Value();
					YearOfBirth=YearOfDiagnosis-AgeAtDiagnosis;
					
					// Create the new person
					PNotification[PCount]=new PersonObject(YearOfBirth, SexIndex);
					
					// Set the diagnosis date for the individual
					PNotification[PCount].HCV.Diagnosed.Set(1, YearOfDiagnosis);
					
					//Set the state value (choose the next in the list which has been randomised above)
					PNotification[PCount].Location.Set(StateVector[PCount], YearOfBirth);
					PCount++;
				}
			}
		}
	}

	console.log("Total notifications loaded "+ PCount);

	return PNotification;
}

console.log("Loaded assignpoplation.js");