function DetermineHCVTransmissions(Person, Time, TimeStep){
	
	var NumberOfTransmissions=0;
	
	// start by determining who is alive and who is not (to save time in sub functions)
	var PWID=SelectPWID(Person, Time);
	var TotalPWID=PWID.length;
	for (var Pn in PWID){
		// choose a person at random in all PWID (to get the right ratio of non-)
		var IndexOfPartner=Floor(TotalPWID*Rand.Value());
		if (PWID[IndexOfPartner].HCV.Infected.Value(Time)==1){
			if (Rand.Value()<Param.HCV.ProbabilityOfTransmission){
				// Determine genotype of the person, then create a new infection 
				var GenotypeArray=PWID[IndexOfPartner].HCV.Genotype.Value(Time);
				PWID[Pn].HCV.Infection(Time+TimeStep*Rand.Value(), GenotypeArray);
				NumberOfTransmissions++;
			}
		}
	}
	
	return NumberOfTransmissions;
	
	
	//DetermineInjectingTransmissions(AlivePerson, Time, TimeStep);
	//DetermineMSMTransmissions(AlivePerson, Time, TimeStep);
	//DetermineSexualTransmissions(AlivePerson, Time, TimeStep);


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



