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
		// Intervention(Time); 
	
	// this is a function that will be called "AdvanceModel(YearLast, YearCurrent, Param, Population)
		// determine number of individuals added the population of PWID
		// Param.IDU.Add
		
		// Add new people to the IDU population for this time step
		
		
		// Start the individuals on IDU
			// General mortality
			// Determine staying probability
			// Determine exit rate
			// PWID additional mortality
			// determine number with regular sex partners (approximately 50%, NSP survey)
			// determine number with casual sex partners
			// Determine when the sexual partners begin their partnership (could be before starting injecting or after)
			// what proportion had partners who did not inject drugs
			
			// Risky injection. Determine 
				// if the persons will practice receptive sharing of injecting equipment 
				// when the will stop if they do.
				// who they are sharing with
			
		// Duration of relationship
			// Determine how many relationships the population is missing
			var TotalSex=[];
			TotalSex[0]=0;//None

			TotalSex[1]=0;//Regular
			TotalSex[2]=0;//Other
			TotalSex[3]=0;//RegularAndOther
			
			var TotalSexAny=0;//Any
			
			for (var Pn in Person){
				if (Person[Pn].CurrentlyAlive==true && Person[Pn].IDU.InjectingStatus==true){
					var SexIndex=Person[Pn].RelationshipStatus.Get;
					TotalSex[SexIndex]++;
					if (SexIndex>0){
						TotalSexAny++;
					}
				}
			}
			
			//Find proportion having sex
			var TotalPeople=TotalSex[0]+TotalSexAny;
			var ProportionAnySex=TotalSexAny/TotalPeople;
			var PropPartnerType=Divide(TotalSex, TotalSexAny);
			
			if (ProportionAnySex<Param.IDU.Sex.AnyLastMonth){
				var NumberOfPeopleToStartAnyRelationship=Round(TotalPeople*(Param.IDU.Sex.AnyLastMonth-ProportionAnySex));
				
				// add people into relationship type as appropriate
				PropPartnerType
				//
				
				// Determine probability that an IDU individual will form a relationship with someone who is not an injector
				
				// If one injector, one not, use injectors' sex to determine the age difference
				
				// If both injectors, choose at random either male or female
				
				// choose a person based on a weighting by age (this is from a list of people compiled outside the loop
					// each person is given a score out of 100 
					// the total score for the population is determined
					// a random number is chosen between 0 and the total
					// run down the array, adding until the total is beaten 
					// remove the element from the array
					// reduce the total by the weighting of the individual removed
				
				// If regular, determine relationship length
				var ThisPartnershipDuration=DeterminePartnerDuration(Param.IDU.Sex.PPartnerChangeYear1,Param.IDU.Sex.PPartnerChangeYear1);
				
				// Determine if the regular partner also injects
				// If true, find someone in the simulation to match with based on age
				
				// Select partners at random to match
				
				// Add this to the partnership records
					
					
				// if it is a person outside the scope of the simulation, they get a negative number
			}
			
			// Give individuals relationships
				// Using Dyadic Data for a Network Analysis of HIV Infection and Risk Behaviors Among Injecting Drug Users
				// Alan Neaigus, Samuel R. Friedman, Marjorie Goldstein, Gilbert Ildefonso, Richard Curtis, and Benny Jose
				// Table 4, <1 year 36% 1-5 years 29% >5 Years 35%
				
				// TABLE 4. Duration of drug injectors’ relationships.
				// Length of time they have: 1 Year > 1 Year,
				// 5 years > 5 Years
				// Injected with their drug injecting
				// network members
				// Known their drug-injecting
				// network members
				// 44% 33% 23%
				// 28% 30% 42%
				// Been having sex with their sex
				// partners
				// 36% 29% 35%

			
		// Determine transmissions that occur
			// if either are HCV infected
			// Determine, for each individual if they will receptively share needles
			
			// Use transmission probability to determine transmission rate
			
			
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

