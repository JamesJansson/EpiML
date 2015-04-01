//

function AssignSexualPartner(Person, Time){
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
			var SexIndex=Person[Pn].SexualPartner.Value(Time);
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
		
		for (var AddCount=0; AddCount<NumberOfPeopleToStartAnyRelationship; AddCount++){
			// Chose people at random until 
			var SamplesFound=0;
			var TestIndex;
			var TestIndexSelectionVector=[];
			var TestIndexSelectionWeight=[];
			while (SamplesFound<10){
				TestIndex=Floor(Rand.Value()*Person.length);
				// Check that the person is alive and eligible to start a new relationship
				if (Person[TestIndex].Alive(Time) && Person[Pi].SexualPartner.Value(Time)<1){
					// note: this section should probably include something that determines the probability that the person will be sexually active
					TestIndexSelectionVector.push(TestIndex);
					TestIndexSelectionWeight.push(SexualRelationship.RateOfSexAtAge(Person[TestIndex].Age(Time)));
				}
			}
			
			// Do the simple index selection of a single element
			var IndexOfTestIndexToSelect=RandSampleWeighted(TestIndexSelectionWeight);
			var SelectedPersonIndex=TestIndexSelectionVector[IndexOfTestIndexToSelect];
			
			var SelectedPerson=Person[SelectedPersonIndex];
			
			
			var AgeAim;
			if (SelectedPerson.Sex==0){
				AgeAim=SexualRelationship.ChooseMaleAge();
			}
			else{
				AgeAim=SexualRelationship.ChooseFemaleAge();
			}
			var PartnerSex=Abs(SelectedPerson.Sex-1);
			
			// Determine probability that an IDU individual will form a relationship with someone who is not an injector
			// Note that there are more males than females. We can include this group 
			if (Rand.Value()<(IDU.Sex.RegularPartnerInjects/2){
				// Select partner from injecting population
				
				// Search injectors for matches
				var AgeDiff;
				var AgeDiffChosen=1e9;
				var IndexChosen;
				for (var Pi2 in Person){
					if (Person[Pi2].Sex==PartnerSex && Pi2!=SelectedPersonIndex){
						AgeDiff=Abs(AgeAim-Person[Pi2].Age(Time));
						if (AgeDiff<AgeDiffChosen){
							IndexChosen=Pi2;
						}
					}
				}
				// Add the sexual relationship to the person
				Pi2;
				
			}
			else {// If the partner is not an injector
				
			}
			
			
			
			
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
}