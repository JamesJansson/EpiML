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
	
	
	for (){// each time step
	// this is a function that will be called "AdvanceModel(YearLast, YearCurrent, Param, Population)
		// determine number of individuals added the population of PWID
		// Param.IDU.Add
		
		
		// Start the individuals on IDU
			// General moratlity
			// Determine staying probability
			// Determine exit rate
			// PWID additional mortality
		
		// Determine transmissions that occur
			// Number of infected active injectors * T0
			
			// Run through infection
			// Clearance

			// HCV progression
			// Determine additional mortality due to HCV
		
		// Testing
			// If testing occurs prior to death, add the time to Person.HCV.DiagnosisDate
		
			// Pull out all people who reach symptomatic testing
			// Reduce diagnoses in that year/sex/age group
			
			// Simply pull out the number of diagnoses in the age/sex group as it appears in the table
			
			// Keep track of diagnoses that could not be pulled out of that group. penalise that sim heavily
		
		// Determine treatment
			// X number per year are treated out of those who are diagnosed
			// If treated change future history of HCV
				// HCV.TreatmentClearance(date)
					// Removes HCV related death
					// Removes HCV related HCC
					// Removes HCV related liver disease advancement
					// Determines retraction of liver disease
		
		
		
		
		
		// lots of points are lost for insufficient diagnoses 
		
		
		
		// If the year is the first year of the simulation
			// Give the injecting
		
		// Join diagnoses in model to the expected 
		
		// Keep 
	
		// Run the individuals through exit
		// PWIDExit(PWIDPopulation);
		

		// Keep HCV prevalence flat in line with data from NSP surveys
		// 
	
		// HCV transmission
		// Run HCV transmission
		
		
		
		
		// HCV testing
		// Param.HCV.TestingRate from NSP survey
		
		// Treatment
		
		// HCV mortality
		
		
	}
	
	// 
	
	
	
	// Create HCV notification population
	
	// Match to population (including choosing individuals that are not diagnosed by the end of the data)
	// Assign dates to those with diagnoses
	// In the first year that you have results
		// Find the number of diagnoses in the earlier model
		// For every diagnosis, 
	
	
	return Population;
}

function CreateHCVInfectedBloodRecipients(){
	Param.Haemophilia.Total2013;
	// Data.Population.Total
	// Data.Population.Migration
	// Data.Population.Deaths
	// Data.Population.Births
	
	// THIS MUST BE MOVED TO THE INTERFACE
	Data.GeneralPopulation={};
	Data.GeneralPopulation.Year=DataFile.GeneralPopulation.GetColumn(0, 1, 43);
	Data.GeneralPopulation.Size=DataFile.GeneralPopulation.GetColumn(1, 1, 43);
	Data.GeneralPopulation.Births=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Migration=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Deaths=DataFile.GeneralPopulation.GetColumn(3, 1, 43);
	
	
	//Determine total population by year
	
	//Interpolate to get number of new cases per year
	
	
	

	// Create a distribution which is based on 10000 samples
	// Roughly add to the 
	// Age them
	// This is the starting age distribution
	// Randomly assign people with HCV or not
	
	
	
	// 
	
	Param.Haemophilia.HCV.Prevalence1973;
	Param.Haemophilia.HCV.Prevalence1980;
	Param.Haemophilia.HCV.Prevalence1990;
	
	Param.HCV.Prevalence.Haemophiliacs1960;
	
}


function ErrorOfFullModel(){
	// Error categories:
	// Ever injected
	// Recently injected
	// Ratio of standard deviation to the mean is basically the same in recent injectors over time (last x years)
	// Error of difference between diagnosed data and undiagnosed
	//
}


function RunAndLink(){
	// this is the final step before a normal run of the model occurs
	
	// Run the model with optimised parameters, but this time with double (?) the number of individuals 
		// starting injecting
		// treatment numbers
		// 

	// Create a table that determines the diagnoses by year, age and sex (later state)
		// Store this table for error analyses later
	
	// sort the diagnoses by year, age and sex (later state)
	// Initialise object
		// Ind=DetermineIndicies(SimPerson);
		// determine sexindex
		// determine yearindex
		// determine ageindex
		PopRef[Ind.Sex][Ind.Year][Ind.Age].listpeople.push(i);
	
	// Convert ALL diagnoses in the model to real diagnoses
	// i.e. notification cases
	// for each notification
		Ind=DetermineIndicies(NotificationPerson);
		// choose a diagnosis that matches it in terms of sex and age
		NumInArray=PopRef[Ind.Sex][Ind.Year][Ind.Age].listpeople.length;
		// If no available individual remaining
		// may choose the same diagnosis multiple times but it MUST be duplicated using DeepCopy
		
		// If none available in category of diagnoses
			// may choose nearest neighbour
		
	// determine difference 
		
	
	// Delete all un-matched diagnoses
	
	// Randomly remove undiagnosed individuals in the model at the same proportion as 
}

