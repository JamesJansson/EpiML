function AssignPopulation(Data, Param){
	var PNotification=[];// an array that stores the notifications
	var PCount=0; // Number of people currently added to the notification file
	
	//Param.SampleFactor
	//Param.DuplicateFactor// maybe a per year by age probability, 
	
	
	
	StateNotificationCount=Data.StateNotifications.slice();//copy state notifications, because we plan count down the number of 
	
	

	// Choose the age and sex from the notifications table
	// For each of the sexes
	Sex=[];
	Sex[0].Notifications={};
	Sex[0].Notifications=Data.MaleNotifications;
	Sex[1].Notifications={};
	Sex[1].Notifications=Data.FemaleNotifications;
		// For each year
		
		
		
		// Scale down state notifications (by both the SampleFactor and the DuplicateFactor
	
		// Create a vector of notifications by state, e.g. [0, 1, 7, 3, ...] that can be sampled sequentially 
		
		// Later: for each state create a vector of aboriginality [0, 0, 1, 1, 0, 0...]
		
		
		// For each age group
			EstimateInThisGroup=Math.round(Data.MaleNotifications/Param.SampleFactor
			//Compensating for using a representative sample
			//note that Math.round() will not give the full picture (groups with <0.5 people will always have less, and groups with >0.5 will always have more than they should
			//To compensate, the algorithm adds a person with a probability based on the remainder
			// e.g. and entry with 3.4 people will give 3 people plus one extra person with 40% probability 
			
			
		// Choose the state from the remaining population
		StateNotificationCount[SomeReference]=StateNotificationCount[SomeReference]-1;
		PNotification[i]=new PersonObject(YearOfBirth, Sex);
		//Set the state value
		
		
		// Set the diagnosis date for the individual
		PNotification[i].HCV.Diagnosed.Set(Year+Rand.Value());



	return PNotification;
}