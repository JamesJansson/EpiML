function  HCVObject(YearOfBirth)
{
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

HCVObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};


HCVObject.prototype.Infection= function (Year, GenotypeValue, Age, Sex, Alcohol, HCVParam ){
	//Special note about recalculating Fibrosis: if fibrosis needs to be recalculated, care should be taken to avoid extending time until Fibrosis, as a person who is late F3 would  
	//This will become especially important in cases where alcoholism begins. In such cases, the remaining time (e.g. 3.5 years to F4) should be shortened accordingly, not recalculated from scratch)
	
	this.GenotypeState[GenotypeValue]=1;
	this.Genotype[GenotypeValue].Set(1, Year);
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
		var TimeUntilClearance;
		if (Rand.Value()<HCVParam.SpontaneousClearance){
			TimeUntilClearance=TimeUntilEvent(HCVParam.YearlyRateOfClearanceInClearers);
			
			this.Infected.Set(0, Year+TimeUntilClearance);
			this.Genotype[GenotypeValue].Set(0, Year+TimeUntilClearance);
		}
		else {//progress to fibrosis
		
			//Determine time until Fibrosis
			//F0-F4-LF are mutually exclusive, HCC is not mutually exclusive to the other states
			var TimeF0F1=TimeUntilEvent(HCVParam.F0F1);
			var DateF1=Year+TimeF0F1;
			this.Fibrosis.Set(1, DateF1);
			
			var TimeF1F2=TimeUntilEvent(HCVParam.F1F2);
			var DateF2=DateF1+TimeF1F2;
			this.Fibrosis.Set(2, DateF2);
			
			var TimeF2F3=TimeUntilEvent(HCVParam.F2F3);
			var DateF3=DateF2+TimeF2F3;
			this.Fibrosis.Set(3, DateF3);
			
			var TimeF3F4=TimeUntilEvent(HCVParam.F3F4);
			var DateF4=DateF3+TimeF3F4;
			this.Fibrosis.Set(4, DateF4);
			
			var TimeF4LF=TimeUntilEvent(HCVParam.F4LF);
			var DateLF=DateF4+TimeF4LF;
			this.Fibrosis.Set(5, DateLF);
			
			
			// Determine time until HCC
			var TimeF4HCC=TimeUntilEvent(HCVParam.F4HCC);
			var DateHCC=DateF4+TimeF4HCC;
			this.HCC.Set(1, DateHCC);
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






HCVObject.prototype.Status= function (Year){//returns all the relevant information from this year (infection status, genotype, diagnosis status, treatment etc)


};




console.log("Loaded hcv.js");


