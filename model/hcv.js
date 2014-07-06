function  HCVObject(YearOfBirth)
{
	//State variables
	this.InfectedState=0;
	this.AntiBodyState=0;
	this.DiagnosedState=0;
	this.GenotypeState=[0, 0, 0, 0, 0, 0]; 
	
	//History variables
	this.Infected=new EventVector;
	//this.AntiBody=new EventVector;//?
	this.Diagnosed=new EventVector;
	//AntibodyDiagnosis
	this.Fibrosis=new EventVector;//including liver failure
	this.HCC=new EventVector;
	this.Genotype[0]=new EventVector;
	this.Genotype[1]=new EventVector;
	this.Genotype[2]=new EventVector;
	this.Genotype[3]=new EventVector;
	this.Genotype[4]=new EventVector;
	this.Genotype[5]=new EventVector;
	
	
	//Initialise history variables
	this.Infected.Set(0, YearOfBirth);//note: to set an infection from birth, call HCV.Infection(YearOfBirth,...
	this.Fibrosis.Set(0, YearOfBirth);
	this.HCC.Set(0, YearOfBirth);
	this.Genotype=[];
	this.Genotype[0].Set(0, YearOfBirth);
	this.Genotype[1].Set(0, YearOfBirth);
	this.Genotype[2].Set(0, YearOfBirth);
	this.Genotype[3].Set(0, YearOfBirth);
	this.Genotype[4].Set(0, YearOfBirth);
	this.Genotype[5].Set(0, YearOfBirth);
	
}

HCVObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};


HCVObject.prototype.Infection= function (Year, GenotypeValue, Age, Sex, Alcohol, HCVParam ){
	//Special note about recalculating Fibrosis: if fibrosis needs to be recalculated, care should be taken to avoid extending time until Fibrosis, as a person who is late F3 would  
	//This will become especially important in cases where alcoholism begins. In such cases, the remaining time (e.g. 3.5 years to F4) should be shortened accordingly, not recalculated from scratch)
	
	this.GenotypeState[GenotypeValue]=1;
	this.Genotype[GenotypeValue].Set(1, Year);
	
	if (this.InfectedState==0){//if not already infected (don't want to start fibrosis from f1)
		//State variables
		this.InfectedState=1;
		this.AntiBodyState=1;
		
		//History variables
		this.Infected.Set(1, Year);
		this.AntiBodiesYear=Year;
		
		//Determine if spontaneous clearance occurs
		if (HCVParam.SpontaneousClearance>Math.random()){
			Math.random
		}
		
		
		//Determine time until Fibrosis
		//F0-F4-LF are mutually exclusive, HCC is not mutually exclusive to the other states
		TimeUntilEvent(HCVParam.F0F1);
		TimeUntilEvent(HCVParam.F1F2);
		TimeUntilEvent(HCVParam.F3F4);
		TimeUntilEvent(HCVParam.F4HCC);
		TimeUntilEvent(HCVParam.F4LF);
	}
	
	
};

//function Treatment
//If successful run SustainedVirologicalResponse

//function Cure
// this.Infected=0
// determine time until fibrosis recovery





HCVObject.prototype.CurrentlyInfected= function (Year){

	// rather than doing this, why not simply do Person[i].HCV.Infected.Get(1999)?
};


HCVObject.prototype.Status= function (Year){//returns all the relevant information from this year (infection status, genotype, diagnosis status, treatment etc)


};
