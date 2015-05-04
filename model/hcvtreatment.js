function  HCVTreatment(Name, Duration, GeneralEfficacy,  GenotypeEfficacy, PatentExpires, OnPatentCost, OffPatentCost, AdverseEvents, Restrictions){
	this.Name=Name;
	this.ShortName=ShortName;
	
	this.Duration=Duration;
	
	this.GeneralEfficacy=GeneralEfficacy;
	this.GenotypeEfficacy=GenotypeEfficacy;// an array (with references that going by genotype name) that give genotype specific efficacy
	
	this.PatentExpires=PatentExpires;
	
	this.OnPatentCost=OnPatentCost;
	this.OffPatentCost=OffPatentCost;
		
	this.AdverseEvents=AdverseEvents;// a function that determines what adverse events occur
	this.Restrictions=Restrictions;// a function that determines whether the medication has restrictions
	
	
	
	//Restrictions are conditions that prevent the use of the drug. They are used to determine if a drug 
	// is unsuitable. e.g. some drugs cannot be used if the individual is depressed or has renal failure

	
}

HCVTreatment.prototype.StartTreatment= function (ThisPerson, Time){
	var CurrentGenotypeInfection=ThisPerson.HCV.Genotype.Value(Time);
	
	var ClearanceProb;// used as a holder
	var ClearanceDeterminant=Rand.Value();// choose a single value, to essentially determine 
	
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
	
	ThisPerson.HCV.Genotype.Set(this.Duration+Time, GenotypeArrayFollowingTreatment);
	
	
	
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
}




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
	var AliveArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			AliveArray.push(Person[Pn]);
		}
	}
	return AliveArray;
}

function SelectPeopleHCVInfection(Person, Time){
	var HCVInfectedArray=[];
	for (var Pn in Person){
		if (Person[Pn].Alive(Time)){
			if (Person[Pn].HCV.Infected.Value(Time)==1){
				HCVInfectedArray.push(Person[Pn]);
			}
		}
	}
	return HCVInfectedArray;
}

function SelectPeopleHCVInfectionGenotype(Person, Time, Genotype){
	var GenotypeArray=[];
	
	if (typeof(Genotype)=='object'){// select the person if any of the genotypes present in the Genotype array are present
		for (var Pn in Person){
			if (Person[Pn].Alive(Time)){
				if (Person[Pn].HCV.Infected.Value(Time)==1){
					var GenotypesAtCurrentTime=Person[Pn].HCV.Genotype.Value(Time);
					var PersonAdded=false;
					for (var GenotypeIndex in Genotype){// this is probably slow given that the person is selected after the first match
						if (GenotypesAtCurrentTime.indexOf(Genotype[GenotypeIndex])>-1 && PersonAdded==false){
							GenotypeArray.push(Person[Pn]);
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
						GenotypeArray.push(Person[Pn]);
					}
				}
			}
		}
	}
	return GenotypeArray;
}