function AssignPopulation(Data, Param){
	var PNotification=[];// an array that stores the notifications
	var PCount=0; // Number of people currently added to the notification file
	var NumAgeGroups=Data.MaleNotifications.Age.length;
	
	
	
	//Param.SampleFactor
	Param.DuplicateFactor=0;// maybe a per year by age probability, 
	
	
	
	//var StateNotificationCount=Data.StateNotifications.slice();//copy state notifications, because we plan count down the number of 
	
	var StateVector;
	var CountingTotal;

	// Choose the age and sex from the notifications table
	// For each of the sexes
	var Sex=[];
	Sex[0]={};
	Sex[0].Notifications={};
	Sex[0].Notifications=Data.MaleNotifications;
	Sex[1]={};
	Sex[1].Notifications={};
	Sex[1].Notifications=Data.FemaleNotifications;
	
	console.log("Starting to assign");
	
	// For each year
	for (var YearIndex=0; YearIndex<Data.StateNotifications.Year.length; YearIndex){
		Year=Data.StateNotifications.Year[YearIndex];
		
		console.log("Starting year "+Year);
		
		StateVector=[];//reset
		CountingTotal=0;
		for (var StateIndex=0; StateIndex<Data.StateNotifications.State.length; StateIndex++){
			console.log("Starting State "+StateIndex);
			// Scale down state notifications (by both the SampleFactor and the DuplicateFactor
			// OR maybe don't bother, just create the vector, shuffle then let the scale down of age/sex notifications take care of it
	
			// Create a vector of notifications by state, e.g. [0, 1, 7, 3, ...] that can be sampled sequentially 
			for (var CountInThisState=0; CountInThisState<Data.StateNotifications.Table[StateIndex][YearIndex]; CountInThisState++){
				StateVector[CountingTotal]=Data.StateNotifications.State[StateIndex];
				CountingTotal=CountingTotal+1;
			}
		}
		StateVector=Shuffle(StateVector);
		
		//post back a sample of the StateVector
		console.log("The year "+Year+" had" + CountingTotal + " people. Sample:");
		self.postMessage({Console: StateVector});
		//for (var i=0; i<100; i++){
		//	console.log(StateVector[i]);
		//}
		
		// Later: for each state create a vector of aboriginality [0, 0, 1, 1, 0, 0...]
		// HIV coinfection
		
		// Alcoholism
		
		
		
		
		
		
		// For each age group
		for (var AgeIndex=0; AgeIndex<NumAgeGroups; AgeIndex++){
			for (var SexIndex=0; SexIndex<2; Sex++){
				//EstimateInThisGroup=Math.round(Data.MaleNotifications/Param.SampleFactor
				
				EstimateInThisGroup=Sex[SexIndex].Notifications[AgeIndex][SexIndex];
				//Compensating for using a representative sample
				//note that Math.round() will not give the full picture (groups with <0.5 people will always have less, and groups with >0.5 will always have more than they should
				//To compensate, the algorithm adds a person with a probability based on the remainder
				// e.g. and entry with 3.4 people will give 3 people plus one extra person with 40% probability 
				EstimateInThisGroup=EstimateInThisGroup
				
				
			}
		}
		// Choose the state from the remaining population
		StateNotificationCount[SomeReference]=StateNotificationCount[SomeReference]-1;
		PNotification[i]=new PersonObject(YearOfBirth, Sex);
		//Set the state value
		
		
		// Set the diagnosis date for the individual
		PNotification[i].HCV.Diagnosed.Set(Year+Rand.Value());
	}


	return PNotification;
}