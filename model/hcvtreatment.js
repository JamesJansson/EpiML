function  HCVTreatment(TSettings){
	// TSettings.Name="sofosbuvir";
	// TSettings.Duration=12*7/365;
	// TSettings.GeneralEfficacy=0.60;
	// TSettings.GenotypeEfficacy=[];
	// TSettings.GenotypeEfficacy["1a"]=0.96;
	// TSettings.PatentExpires;// Filing date 20/05/2010 + 20
	// TSettings.OnPatentCost=80000; 
	// TSettings.OffPatentCost=300;
	// // for future release
	// TSettings.Restriction=[];// array of functions
	// TSettings.Restriction[0]=function(Person, HCVTreatment){};
	// //Restrictions are conditions that prevent the use of the drug. They are used to determine if a drug 
	// // is unsuitable. e.g. some drugs cannot be used if the individual is depressed or has renal failure
	// TSettings.AdverseEvents=[];
	// TSettings.AdverseEvents[0]={};
	
	
	this.Name=TSettings.Name;
	
	this.Duration=TSettings.Duration;
	
	this.GeneralEfficacy=TSettings.GeneralEfficacy;
	this.GenotypeEfficacy=TSettings.GenotypeEfficacy;// an array (with references that going by genotype name) that give genotype specific efficacy
	
	if (typeof(TSettings.PatentExpires)!="undefined"){this.PatentExpires=TSettings.PatentExpires;}
	if (typeof(TSettings.OnPatentCost)!="undefined"){this.OnPatentCost=TSettings.OnPatentCost;}
	if (typeof(TSettings.OffPatentCost)!="undefined"){this.OffPatentCost=TSettings.OffPatentCost;}
	
	if (typeof(TSettings.AdverseEvents)!="undefined"){this.AdverseEvents=TSettings.AdverseEvents;}
	if (typeof(TSettings.Restrictions)!="undefined"){this.Restrictions=TSettings.Restrictions;}
	
	
	//Restrictions are conditions that prevent the use of the drug. They are used to determine if a drug 
	// is unsuitable. e.g. some drugs cannot be used if the individual is depressed or has renal failure

	
}

HCVTreatment.prototype.StartTreatment= function (ThisPerson, Time){
	var CurrentGenotypeInfection=ThisPerson.HCV.Genotype.Value(Time);
	
	var ClearanceProb;
	var ClearanceDeterminant=Rand.Value();
	// Choose a single value, to essentially determine the probability of clearance
	// This is important because it is likely that the reason a genotype will clear is because a patient is adherent
	
	var GenotypeArrayFollowingTreatment=[];
	
	// For each genotype present, determine if cleared
	for (var GenotypeCount in CurrentGenotypeInfection){// note the gneotype in this case is an array of strings
		// if the Genotype is present in the function
		var GenotypeName=CurrentGenotypeInfection[GenotypeCount];
		if (typeof(this.GenotypeEfficacy[GenotypeName])!="undefined"){
			ClearanceProb=this.GenotypeEfficacy[GenotypeName];
		}
		else{
			ClearanceProb=this.GeneralEfficacy;
		}
		
		if (ClearanceDeterminant<ClearanceProb){
			// clearance occurs
			// do nothing
		}
		else {
			// add this to the genotype that will exist following treatment
			GenotypeArrayFollowingTreatment.push(GenotypeName);
		}
		
			// determine the genotype specific rate of clearance
		// else 
			// use the general rate
	}
	// Set the time at which treatment starts and ends
	
	if (GenotypeArrayFollowingTreatment.length==0){
		ThisPerson.HCV.Clearance(Time+this.Duration);
	}
	else{
		ThisPerson.HCV.Genotype.Set(GenotypeArrayFollowingTreatment, Time+this.Duration);
	}
	
	ThisPerson.HCV.TreatmentCosts.Set(this.Cost(Time), Time);
	
	
	
	// Determine adverse events
	// for each 
		// Determine if it occurs
		// Determine if treatment is ceased as a result
	
	// Determine if clearance occurs or not 
	
};

HCVTreatment.prototype.Cost=function(Time){
	if (Time<this.PatentExpires){
		return this.OnPatentCost;
	}
	return this.OffPatentCost;
};

HCVTreatment.prototype.Eligible=function(Person, Time){
	for (var RCount in this.Restrictions){
		
	}
	return this.OffPatentCost;
};


function DetermineHistoricalTreatment(Person, Time, TimeStep, TreatmentNumbers){//TreatmentNumbers is an array of each of the treatment types
	// Determine number of treatments handed out in this step of each type
		// Find appropriate year
		// Amount
		
	// Randomly assign treatement 
}

function DetermineTreatment(Person, Time, TimeStep){
	
}
	
function TreatmentScenario1(Person, Time, TimeStep){
	// people are given treatment at roughly existing rates
	// Randomly send off 1000 new treatments per year of existing 
	// work out the number to be given treatment this time step
	var NumberTreatedPerYear=1000;
	var TreatedThisStep=TimeStep*NumberTreatedPerYear;
	
	var HCVInfectedPop=SelectPeopleHCVInfection(Person, Time);
	var ShuffledHCVInfectedPop=Shuffle(HCVInfectedPop);
	
	HCVTreatmentArray["PegIA2aRiba"].StartTreatment(ShuffledHCVInfectedPop[PCount], Time);
	
	
	
	// Count all people that are Alive with an active HCV infection
	// add them to a list 
	// choose the 1000 at random
	// treat
}

// below is an example of a meta treatment scenario, which include an extension of the status quo, but a switch to  TreatementScenario2 in 2016
function TreatementScenario3(Person, Time, TimeStep){
	if (Time<2016){
		TreatementScenario1(Person, Time, TimeStep);
	}
	else {
		TreatementScenario2(Person, Time, TimeStep);
	}
}

function SelectPeopleAlive(Person, Time){
	var PersonArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			PersonArray.push(Person[Pn]);
		}
	}
	return PersonArray;
}

function SelectCurrentPWID(Person, Time){
	var PersonArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			if (Person[Pn].IDU.CurrentlyInjecting(Time)){
				PersonArray.push(Person[Pn]);
			}
		}
	}
	return PersonArray;
}

function SelectCurrentSharingPWID(Person, Time){
	var PersonArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			if (Person[Pn].IDU.CurrentlySharing(Time) ){
				PersonArray.push(Person[Pn]);
			}
		}
	}
	return PersonArray;
}


function SelectPeopleHCVInfection(Person, Time){
	var PersonArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			if (Person[Pn].HCV.Infected.Value(Time)==1){
				PersonArray.push(Person[Pn]);
			}
		}
	}
	return PersonArray;
}


function SelectPWIDHCVInfected(Person, Time){
	var PersonArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			if (Person[Pn].IDU.CurrentlyInjecting(Time)){
				if (Person[Pn].HCV.Infected.Value(Time)==1){
					PersonArray.push(Person[Pn]);
				}
			}
		}
	}
	return PersonArray;
}







function SelectPeopleHCVInfectionGenotype(Person, Time, Genotype){
	var PersonArray=[];
	
	if (typeof(Genotype)=='object'){// select the person if any of the genotypes present in the Genotype array are present
		for (var Pn in Person){
			if (Person[Pn].Alive(Time)){
				if (Person[Pn].HCV.Infected.Value(Time)==1){
					var GenotypesAtCurrentTime=Person[Pn].HCV.Genotype.Value(Time);
					var PersonAdded=false;
					for (var GenotypeIndex in Genotype){// this is probably slow given that the person is selected after the first match
						if (GenotypesAtCurrentTime.indexOf(Genotype[GenotypeIndex])>-1 && PersonAdded==false){
							PersonArray.push(Person[Pn]);
							PersonAdded=true;
						}
					}
				}
			}
		}
	}
	else{// do the simple fast search for the value stored in Genotype
		for (var Pn in Person){
			if (Person[Pn].Alive(Time)){
				if (Person[Pn].HCV.Infected.Value(Time)==1){
					var GenotypeAtCurrentTime =Person[Pn].HCV.Genotype.Value(Time);
					if (GenotypeAtCurrentTime.indexOf(Genotype)>-1){
						PersonArray.push(Person[Pn]);
					}
				}
			}
		}
	}
	return PersonArray;
}