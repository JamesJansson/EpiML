function  HCVObject()
{
	//State variables
	this.InfectedState=0;
	this.AntiBodyState=0;
	this.DiagnosedState=0;
	this.GenotypeState=[0, 0, 0, 0, 0, 0]; 
	
	//History variables
	this.Infected=new EventVector;
	this.Fibrosis=new EventVector;//including liver failure
	this.HCC=new EventVector;


}

HCVObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};


HCVObject.prototype.Infection= function (Year, GenotypeValue, Age, Alcohol, HCVParam ){
	//Special note about recalculating Fibrosis: if fibrosis needs to be recalculated, care should be taken to avoid extending time until Fibrosis, as a person who is late F3 would  
	//This will become especially important in cases where alcoholism begins. In such cases, the remaining time (e.g. 3.5 years to F4) should be shortened accordingly, not recalculated from scratch)
	
	this.GenotypeState[GenotypeValue]=1;
	
	if (this.Infected==0){//if not already infected (don't want to start fibrosis from f1)
		//State variables
		this.InfectedState=1;
		this.AntiBodyState=1;
		
		//History variables
		this.InfectedYear=Year;
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


};


HCVObject.prototype.Status= function (Year){//returns all the relevant information from this year (infection status, genotype, diagnosis status, treatment etc)


};
