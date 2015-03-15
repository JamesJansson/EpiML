function FullModel(Param, Data, Intervention){ 
	// Intervention[No]=function(Time){
	// 	   if (Time<2016){
	//         Param.HCV.TreatmentRate=1000;
	//     }else{
	//         Param.HCV.TreatmentRate=Min(1000+Time*5000, 20000);// increase at a rate of 5000 per year until reaching a max of 20000
	//     }
	// };
	
	var PWIDPopulation=DistributePWIDPopulationExponential(Param.IDU.EntryParams);//Returns PWIDPopulation as defined to the MaxYear
	
	// Run HCV blood recipients
	var HCVInfectedBloodRecipients=CreateHCVInfectedBloodRecipients();
	// Add proportions as mentioned in Greg's paper
	// Determine how many end up as PWID

	// Run MSM
	
	// Run migrants
	
	// Determine proportion of each that end up PWID
	
	// Join populations
	var Population=[];
	Population.concat(PWIDPopulation, HCVInfectedBloodRecipients);// Later add MSM and migrants
	
	
	for (){
		// Run the individuals through exit
		// PWIDExit(PWIDPopulation);
		// PWID additional mortality
		
		// HCV transmission
		// Run HCV transmission
		
		
		
		
		// HCV testing
		// Param.HCV.TestingRate from NSP survey
		
		// Treatment
		
		// HCV mortality
	}
	// Create HCV notification population
	
	// Match to population (including choosing individuals that are not diagnosed by the end of the data)
	// Assign dates to those with diagnoses
	// 
	
	
	return Population;
}

function CreateHCVInfectedBloodRecipients(){
	Param.Haemophilia.Total2013;
	// Data.TotalPopulation
	
	
	//Determine total population by year
	
	//Interpolate to get number of new cases per year
	
	
	
	Param.Haemophilia.HCV.Prevalence1960;
	Param.Haemophilia.HCV.Prevalence1970;
	Param.Haemophilia.HCV.Prevalence1980;
	Param.Haemophilia.HCV.Prevalence1980;
	
	// Create a distribution which is based on 10000 samples
	// Age them
	// This is the starting age distribution
	
	// 
	
	Param.Haemophilia_HCV_Prevalence1973
	Param.Haemophilia_HCV_Prevalence1980
	Param.Haemophilia_HCV_Prevalence1990
	
	Param.HCV.Prevalence.Haemophiliacs1960;
	
}