function  HCVTreatment(Name, Duration, Efficacy, EfficacySD, Cost, PatentExpires, ProductionCost, AdverseEvents, Restrictions)
{
	//Restrictions are conditions that prevent the use of the drug. They are used to determine if a drug 
	// is unsuitable. e.g. some drugs cannot be used if the individual is depressed or has renal failure

	//this.Active={};//indicates whether the HCV module is active or not 
	
	//State variables
	this.InfectedState=0;
	this.AntibodyState=0;
	this.DiagnosedState=0;
	this.GenotypeState=[0, 0, 0, 0, 0, 0]; 
	
	//History variables
	this.Infected=new EventVector;
	this.AntibodyYear=NaN;
	this.Diagnosed=new EventVector;
	//AntibodyDiagnosis
	this.Fibrosis=new EventVector;//including liver failure
	this.HCC=new EventVector;
	this.Genotype=[];
	this.Genotype[0]=new EventVector;
	this.Genotype[1]=new EventVector;
	this.Genotype[2]=new EventVector;
	this.Genotype[3]=new EventVector;
	this.Genotype[4]=new EventVector;
	this.Genotype[5]=new EventVector;
	
	//Initialise history variables
	this.Infected.Set(0, YearOfBirth);
	this.Diagnosed.Set(0, YearOfBirth);
	this.Fibrosis.Set(0, YearOfBirth);
	this.HCC.Set(0, YearOfBirth);
	//this.Genotype[0].Set(0, YearOfBirth);
	//this.Genotype[1].Set(0, YearOfBirth);
	//this.Genotype[2].Set(0, YearOfBirth);
	//this.Genotype[3].Set(0, YearOfBirth);
	//this.Genotype[4].Set(0, YearOfBirth);
	//this.Genotype[5].Set(0, YearOfBirth);
	
	//Cascade of care
    this.Assessment=new EventVector;//
    this.Fibroscan=new EventVector;
	this.Biopsy=new EventVector;
	this.UltraSound=new EventVector;
	this.Treatment=new EventVector;
	
	this.HIVCoinfectionTreatment=0;
}

HCVTreatment.prototype.StartTreatment= function (Person, Year){
	// For each genotype present, determine if cleared
	for (Genotype in Person.HCV){
		// if the Genotype is present in the function
			// determine the genotype specific rate of clearance
		// else 
			// use the general rate
	}

	// Determine adverse events
	// for each 
		// Determine if it occurs
		// Determine if treatment is ceased as a result
	
	// Determine if clearance occurs or not 
	
	
	// Person.HCVTreatmentCosts
	
	
	// Set the time at which treatment starts and ends
};

function DetermineHistoricalTreatment(Person, Time, Param.TimeStep, TreatmentNumbers){//TreatmentNumbers is an array of each of the treatment types

}

function DetermineTreatment(Person, Time, Param.TimeStep){
	
}
	


