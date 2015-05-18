//

function AssignSexualPartner(Person, Time){
	// The purpose of this function is to assign the duration of relationship and the relevant connection in the relationship
	// It does so by trying to bring the population rates up to the levels of sexual partnership expected for the population as releationships end
	
	// Determine how many relationships the population is missing
	var TotalSex=[];
	TotalSex[0]=0;//None
	TotalSex[1]=0;//Regular
	TotalSex[2]=0;//Other
	TotalSex[3]=0;//RegularAndOther
	
	var TotalSexAny=0;//Any
	
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)==true && Person[Pn].IDU.Use.Value(Time)>2){// is a current alive injector
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
		
		// Work out what the category will be by maintaining the same ratio
		var NumberInPartnerCategory=[TotalSex[1], TotalSex[2], TotalSex[3]];
		var AimProp=[Param.IDU.Sex.RegularLastMonth, Param.IDU.Sex.OtherLastMonth, Param.IDU.Sex.RegularAndOtherLastMonth];
		var AimNumberInPartnerCategory=Multiply(TotalSexAny, AimProp);
	
		
		for (var AddCount=0; AddCount<NumberOfPeopleToStartAnyRelationship; AddCount++){
			// add people into relationship type as appropriate
			
			var CategorySelectionWeight=Minus(AimNumberInPartnerCategory, NumberInPartnerCategory);
			// if the prop weight is negative, ignore unless they are all negative, then set all to one
			for (var CSWR in CategorySelectionWeight){
				if (CategorySelectionWeight[CSWR]<0){// to avoid situations where a 
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
				
					if (Person[TestIndex].SexualPartner.Value(Time)!=1 && Person[TestIndex].SexualPartner.Value(Time)!=3 ){// if the person doesn't already have a sexual partner
						// note: this section should probably include something that determines the probability that the person will be sexually active
						TestIndexSelectionVector.push(TestIndex);
						TestIndexSelectionWeight.push(SexualRelationship.RateOfSexAtAge(Person[TestIndex].Age(Time)));
						SamplesFound++;
					}
				}
			}
			
			// Do the simple index selection of a single element based on assumed sexual activity
			var IndexOfTestIndexToSelect=RandSampleWeighted(TestIndexSelectionWeight);
			var SelectedPersonIndex=TestIndexSelectionVector[IndexOfTestIndexToSelect];
			
			var SelectedPerson=Person[SelectedPersonIndex];
			
			// Determine the age of the partner that we are aiming for.
			// if Person=MSM
			
			// if Person=Heterosexual
				// Determine the sex of the partner
				var PartnerSex=Abs(SelectedPerson.Sex-1);// a new algorithm needs to go here to determine the sexual partner sex
				var AgeAim;
				if (SelectedPerson.Sex==0){
					AgeAim=SexualRelationship.ChooseMaleAge(SelectedPerson.Age(Time));
				}
				else{
					AgeAim=SexualRelationship.ChooseFemaleAge(SelectedPerson.Age(Time));
				}
			
			
			
			// Determine probability that an IDU individual will form a relationship with someone who is not an injector
			// Note that there are more males than females. 
			if (Rand.Value()<(Param.IDU.Sex.RegularPartnerInjects/2)){// note that we divide by 2 to get the right proportion because this creates a new link between 2 people who are not in a regular relationship
				// Select partner from injecting population
				
				// Search injectors for matches
				var AgeDiff;
				// var AgeDiffAcceptable=0.1;
				// console.log("Needs a proper set here");
				var Pi2;
				
				// The function keeps looking for someone until a level of difference in age is reached that cannot be expected to be beaten. 
				// a random index is chosen, and a limited number of selections take place (e.g. only 1000 people are taken into account when selecting) 
				// an eventuality needs to be taken into consideration where people don't make a partnership, i.e. there is no one in the group that matches their needs
				
				
				var SelectedPersonIndex2=-1;
				var BestDiff=1e9;
				//for (var TestIndex in Person){
				SamplesFound=0;
				while (SamplesFound<100 || SelectedPersonIndex2<0){
					// choose from the array at random
					TestIndex=Floor(Rand.Value()*Person.length);
					
					if (Person[TestIndex].Sex==PartnerSex && TestIndex!=SelectedPersonIndex){
						SamplesFound++;
						AgeDiff=Abs(AgeAim-Person[TestIndex].Age(Time));
						if (AgeDiff<BestDiff){
							// An alternative test could assume that even if it isn't right on the mark, they are candidates for selection
							// this condition would be good for people who are selected at random
							// AgeAim*(1-AgeDiffAcceptable)<AgeAim && AgeAim<=AgeAim*(1+AgeDiffAcceptable) && 
							BestDiff=AgeDiff;
							SelectedPersonIndex2=TestIndex;
						}
					}
				}
				
				if (SelectedPersonIndex2<0){
					console.error("The person index has not been found");
				}
				
				// If regular, determine relationship length
				var ThisPartnershipDuration=DeterminePartnerDuration(Param.IDU.Sex.PPartnerChangeYear1,Param.IDU.Sex.PPartnerChangeYear1);
				
				// Add the sexual relationship to the person
				Person[SelectedPersonIndex].SexualPartnerRegularID.Set(SelectedPersonIndex2, Time);
				Person[SelectedPersonIndex].SexualPartnerRegularID.Set(-1, Time+ThisPartnershipDuration);
				
				
				// Add the sexual partnership to this other person 
				Person[SelectedPersonIndex2].SexualPartnerRegularID.Set(SelectedPersonIndex, Time);
				Person[SelectedPersonIndex].SexualPartnerRegularID.Set(-1, Time+ThisPartnershipDuration);


				
				
			}
			else {// If the partner is not an injector
				// Create an individual of the appropriate age  
				
			}
			
			
			// Choose partner by age 
			// Randomly choose a person
			// Check if they 
			
			
			// choose a person based on a weighting by age (this is from a list of people compiled outside the loop
				// each person is given a score out of 100 
				// the total score for the population is determined
				// a random number is chosen between 0 and the total
				// run down the array, adding until the total is beaten 
				// remove the element from the array
				// reduce the total by the weighting of the individual removed
			
			
			
			
			
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