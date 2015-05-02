function DetermineHCVTransmissions(Person, Time, TimeStep){
	// start by determining who is alive and who is not (to save time in sub functions)
	AlivePerson=[];
	for (var Pi in Person){
		if (Person[Pi].Alive(Time)){
			AlivePerson.push(Person[Pi]);
		}
	}
		
	
	DetermineInjectingTransmissions(AlivePerson, Time, TimeStep);
	DetermineMSMTransmissions(AlivePerson, Time, TimeStep);
	DetermineSexualTransmissions(AlivePerson, Time, TimeStep);
}





function DetermineInjectingTransmissions(Person, Time, TimeStep){
	for (var Pi in Person){
		// Determine if the person is an injector 
		if (Person[Pi].IDU.Use.Value(Time)==1){
			// Determine if they will receptively share needles
			if (Person[Pi].IDU.Sharing.Value(Time)==1){
				// Determine contacts
					// Sexual regular
					// sexual casual
					// non-sexual
				
				// if either are HCV infected
					// Use transmission probability to determine transmission
					// NumberOfTransmissions=InjectingRate;
					// Determine the GenotypeValue
				

				
				// Run through infection
				Person[Pi].HCV.Infection(Time+Rand.Value()*TimeStep, GenotypeValue);
			}
		}
	}
}

function DetermineMSMTransmissions(Person, Time, TimeStep){
	for (var Pi in Person){
		// Determine if the person is MSM 
		if (Person[Pi].MSM==true){
			if (Person[Pi].Alive(Time)==true){// determine if the person is alive
				// Determine sexual partners
				
			}
		}
	}
}



