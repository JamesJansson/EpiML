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
		if (Person[Pn].Alive(Time)==true && Person[Pn].IDU.Use(Time)>2){// is a current alive injector
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
	
	if (ProportionAnySex<Param.IDU.Sex.AnyLastMonth){
		var NumberOfPeopleToStartAnyRelationship=Round(TotalPeople*(Param.IDU.Sex.AnyLastMonth-ProportionAnySex));
		
		var NumberInPartnerCategory=[TotalSex[1], TotalSex[2], TotalSex[3]];
		var AimProp=[Param.IDU.RegularLastMonth, Param.IDU.OtherLastMonth, Param.IDU.RegularAndOtherLastMonth];
		var AimNumberInPartnerCategory=Times(TotalSexAny, AimProp);
	
		// add people into relationship type as appropriate
		TotalPeople*Param.IDU.Sex.AnyLastMonth;
		
		var Temp=[PropPartnerType[1
		
		for (var AddCount=0; AddCount<NumberOfPeopleToStartAnyRelationship; AddCount++){
			// Work out what the category will be
			var CategorySelectionWeight=Minus(AimNumberInPartnerCategory, NumberInPartnerCategory);
			// if the prop weight is negative, ignore unless they are all negative, then set all to one
			for (var CSWR in CategorySelectionWeight){
				if (CategorySelectionWeight[CSWR]<0){
					CategorySelectionWeight[CSWR]=0;
				}
			}
			var PartnershipType=RandSampleWeighted(CategorySelectionWeight)+1;
			NumberInPartnerCategory[PartnershipType-1]++;// add people to category such that the proportions balance
			
			
			// Chose people at random until you have 10 eligible
			var SamplesFound=0;
			var TestIndex;
			var TestIndexSelectionVector=[];
			var TestIndexSelectionWeight=[];
			while (SamplesFound<10){
				TestIndex=Floor(Rand.Value()*Person.length);
				// Check that the person is alive and eligible to start a new relationship
				if (Person[TestIndex].Alive(Time)){
				
					// Here is where you make the selection of the relationship type of the PWID
					// if 1, then can only be zero
					// 		reduce total by 1, add 1 to category
					// if 2, then also can only be zero
					// 		reduce total by 1, add 1 to category
					// if 3, then can only be 1 or 2
					// 		reduce total by 0, add 1 to category
					// remember to perform the same test on the other partner!
				
					if (Person[Pi].SexualPartner.Value(Time)!=1 && Person[Pi].SexualPartner.Value(Time)!=3 ){// if the person doesn't already have a sexual partner
						// note: this section should probably include something that determines the probability that the person will be sexually active
						TestIndexSelectionVector.push(TestIndex);
						TestIndexSelectionWeight.push(SexualRelationship.RateOfSexAtAge(Person[TestIndex].Age(Time)));
					}
				}
			}
			
			// Do the simple index selection of a single element based on assumed sexual activity
			var IndexOfTestIndexToSelect=RandSampleWeighted(TestIndexSelectionWeight);
			var SelectedPersonIndex=TestIndexSelectionVector[IndexOfTestIndexToSelect];
			
			var SelectedPerson=Person[SelectedPersonIndex];
			
			// Determine the age of the partner that we are aiming for.
			var AgeAim;
			if (SelectedPerson.Sex==0){
				AgeAim=SexualRelationship.ChooseMaleAge();
			}
			else{
				AgeAim=SexualRelationship.ChooseFemaleAge();
			}
			// Determine the sex of the partner
			var PartnerSex=Abs(SelectedPerson.Sex-1);
			
			// Determine probability that an IDU individual will form a relationship with someone who is not an injector
			// Note that there are more males than females. 
			if (Rand.Value()<(IDU.Sex.RegularPartnerInjects/2){// note that we divide by 2 to get the right proportion
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
				this.SexualPartner.Set(1, Time);
				this.SexualPartnerID.Set(Pi2, Time);
				this.SexualPartnerInjects.Set(1, Time);
				
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
			
			this.SexualPartner.Set(0, Time+ThisPartnershipDuration);
			this.SexualPartnerID.Set(-1, Time+ThisPartnershipDuration);
			this.SexualPartnerInjects.Set(0, Time+ThisPartnershipDuration);
			
			
			
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