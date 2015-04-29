function DetermineHCVTransmissions(Person, Time, TimeStep){
	DetermineInjectingTransmissions(Person, Time, TimeStep);
	DetermineMSMTransmissions(Person, Time, TimeStep);
	DetermineSexualTransmissions(Person, Time, TimeStep);
}





function DetermineInjectingTransmissions(Person, Time, TimeStep){
	for (var Pi in Person){
		// Determine if the person is an injector 
		if (Person.IDU.Use.Value(Time)==1){
			// Determine if they will receptively share needles
			if (Person.IDU.Sharing.Value(Time)==1){
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



