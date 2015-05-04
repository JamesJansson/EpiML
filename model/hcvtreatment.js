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
	
}

function DetermineTreatment(Person, Time, TimeStep){
	
}
	


