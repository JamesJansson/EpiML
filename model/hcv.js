function  HCVObject(PersonPointer){
	this.Person=PersonPointer;
	
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
	this.Genotype=new EventVector;
	
	
	
	// this.Genotype[0]=new EventVector;//1a
	// this.Genotype[1]=new EventVector;//1b
	// this.Genotype[2]=new EventVector;//2
	// this.Genotype[3]=new EventVector;//3
	// this.Genotype[4]=new EventVector;//4
	// this.Genotype[5]=new EventVector;//5
	// this.Genotype[5]=new EventVector;//6
	
	
	//Initialise history variables
	this.Infected.Set(0, this.Person.YearOfBirth);
	this.Diagnosed.Set(0, this.Person.YearOfBirth);
	this.Fibrosis.Set(0, this.Person.YearOfBirth);
	this.HCC.Set(0, this.Person.YearOfBirth);
	// Set the genotype to an empty array at birth. To add a new 
	this.Genotype.Set([], this.Person.YearOfBirth);
	
	
	//this.Genotype[0].Set(0, this.Person.YearOfBirth);
	//this.Genotype[1].Set(0, this.Person.YearOfBirth);
	//this.Genotype[2].Set(0, this.Person.YearOfBirth);
	//this.Genotype[3].Set(0, this.Person.YearOfBirth);
	//this.Genotype[4].Set(0, this.Person.YearOfBirth);
	//this.Genotype[5].Set(0, this.Person.YearOfBirth);
	
	//Cascade of care
    this.Assessment=new EventVector;//
    this.Fibroscan=new EventVector;
	this.Biopsy=new EventVector;
	this.UltraSound=new EventVector;
	this.Treatment=new EventVector;
	
	
	// Determine if the person is a reinfection protected
	if (Rand.Value()<Param.HCV.PReinfectionProtected){
		this.ReinfectionProtected=true;
	}
	else{
		this.ReinfectionProtected=false;
	}
}




HCVObject.prototype.Infection= function (Year, GenotypeValue){//, Age, Sex, Alcohol, HCVParam ){
	//Special note about recalculating Fibrosis: if fibrosis needs to be recalculated, care should be taken to avoid extending time until Fibrosis, as a person who is late F3 would  
	//This will become especially important in cases where alcoholism begins. In such cases, the remaining time (e.g. 3.5 years to F4) should be shortened accordingly, not recalculated from scratch)
	
	// Do some calculations on reinfection
	// Mehta, 2002 Lancet 359:1478  Reinfection 8.6/100 py -> 5.4/100 py
	// Grebely, 2006 Hepat 44:1139 Reinfection 8.1/100 py -> 1.8/100 py
	// Micallef, 2007 J Viral Hepat 14:413 
	// Aitken, 2008 Hepat 48:1746 
	// Osburn, 2010 Gastro 138:315 
	// Currie, 2008 Drug Alc Dep 93:148
	// Backmund, 2004 Clin Inf Dis 39:1540 
	// Grebely, 2010 J Gastr Hepat 25:1281
	if (!isNaN(this.AntibodyYear)){// if it has been set
		if (this.ReinfectionProtected==true && this.AntibodyYear<Year && this.Infected.Value(Year)==1){
			return 0;
		}
	}
	
	
	
	this.GenotypeState[GenotypeValue]=1;
	this.Genotype[GenotypeValue].Set(1, Year);
	// Superinfection is common, so we assume all people who get infected with a second strain are infected again http://www.cdc.gov/hepatitis/Resources/MtgsConf/HCVSymposium2011-PDFs/20_Blackard.pdf 
	// Super infection does not change the course of Fibrosis in the model
	var NewGenotypeArray=DeepCopy(this.Genotype.Value(Year));// note that sine this is an array, we need to copy it before we operate on it.
	// Check if any of the Genotypes in GenotypeValue exist in the current array
	NewGenotypeArray.push(GenotypeValue);
	var UniqueGenotypeArray = NewGenotypeArray.filter(function(item, pos, self) {
		return self.indexOf(item) == pos;// if the item under inspection is equal to the first occurrence of the item, then keep
	})
	this.Genotype.Set(UniqueGenotypeArray, Year);
	
	// convert this to the this.g1a, this.g1b, g2, g3, g4, 
	// if genotype 1 does not exist
	//     create it
	//     set genotype to 1
	// else if it is not currently set to 1
	//     set HCV.genotype
	//
	
	
	
	
	//Pre-Calculate fibrosis
	if (this.InfectedState==0){//if not already infected (don't want to start fibrosis from f1)
		//State variables
		this.InfectedState=1;
		this.AntibodyState=1;
		
		//History variables
		this.Infected.Set(1, Year);
		this.AntibodyYear=Year;
		
		//Determine if spontaneous clearance occurs
		if (Rand.Value()<Param.HCV.SpontaneousClearance.p){
			var TimeUntilClearance=ExpDistributionRand(Param.HCV.SpontaneousClearance.MedianTime);
			this.Infected.Set(0, Year+TimeUntilClearance);
			this.Genotype.Set([], Year+TimeUntilClearance);
		}
		else {//progress to fibrosis
			var Time;
			//Determine time until Fibrosis
			//F0-F4-LF are mutually exclusive, HCC is not mutually exclusive to the other states
			//F0F1
			Time=TimeUntilEvent(Param.HCV.F0F1);
			var DateF1=Year+Time;
			this.Fibrosis.Set(1, DateF1);
			//F1F2
			Time=TimeUntilEvent(Param.HCV.F1F2);
			var DateF2=DateF1+Time;
			this.Fibrosis.Set(2, DateF2);
			//F2F3
			Time=TimeUntilEvent(Param.HCV.F2F3);
			var DateF3=DateF2+Time;
			this.Fibrosis.Set(3, DateF3);
			//F3F4
			Time=TimeUntilEvent(Param.HCV.F3F4);
			var DateF4=DateF3+Time;
			this.Fibrosis.Set(4, DateF4);
			//F4LF
			var TimeF4LF=TimeUntilEvent(Param.HCV.F4LF);
			var DateLF=DateF4+TimeF4LF;
			this.Fibrosis.Set(5, DateLF);
			
			
			// Determine time until HCC
			Time=TimeUntilEvent(Param.HCV.F4HCCP);
			var DateHCC=DateF4+Time;
			this.HCC.Set(1, DateHCC);
			
			//Determine time until death
			Time=TimeUntilEvent(Param.HCV.F4DeathP);
			var DateHCVDeath=DateF4+Time;
			this.Person.Death.HCV=DateHCVDeath;
			
			// Also look at
				// http://jid.oxfordjournals.org/content/206/4/469.long
		}	
	}
};

//function Treatment
//If successful run SustainedVirologicalResponse

//function Cure
// this.Infected=0
// determine time until fibrosis recovery

HCVObject.prototype.FirstInfected= function (Year){//returns a 
	if (typeof this.Infected=="undefined"){
		return NaN;
	}
	return this.Infected.Time[0];
};


HCVObject.prototype.CurrentlyInfected= function (Year){

	// rather than doing this, why not simply do Person[i].HCV.Infected.Get(1999)?
};

HCVObject.prototype.L4ToHCCTime= function (Param){
	// Degos et al. produced probability with time curves
	//http://www.ncbi.nlm.nih.gov/pubmed/10861275

	// for the first 2 years, there is no chance of HCC. 
	
	// probability of HCC increases from 0 at second year, to 0.35 at the 8th year in a linear fashion
	
	// from 8th year onwards, assume a flat rate
	
	
	
};



HCVObject.prototype.Treatment= function (Year, TreatmentType){//returns a 
	
	// Set the treatment duration
	
	// Get the genotype combination at this point time
	var GenotypeArray=this.Genotype.Value(Year);
	var EfficacyArray=[];
	for (Genotype in GenotypeArray){
		if TreatmentType.Efficacy
	var EfficacyArray=
	if typeof genotype is undefined
	use numerical genotype
	
	}
	
	IndexToSelect is all the genotypes
	// Show on the person that treatment is occurring
	var MinEfficacy=Min(Select(TreatmentType.Efficacy, IndexToSelect));
	
	if the person is multiply 
	
	
	// Determine if clearance occurs
	if (Rand.Value()<TreatmentType.PClearance)[
	
	}


	// If treated change future history of HCV
		// HCV.TreatmentClearance(date)
			// Remove HCV related future death
				// Remove HCV related future HCC
				// Remove HCV related future liver disease advancement
				// Determine retraction of liver disease
	
}









HCVObject.prototype.Status= function (Year){//returns all the relevant information from this year (infection status, genotype, diagnosis status, treatment etc)


};




console.log("Loaded hcv.js");


