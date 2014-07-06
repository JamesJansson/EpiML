function  HCVObject(Infected, Diagnosed)
{
	this.Infected=Infected;
	this.AntiBodies=Infected;
	this.Diagnosed=Diagnosed;
	this.Fibrosis=new EventVector;
	this.HCC=new EventVector;
	this.LF=new EventVector;
	//console.log(this.parentNode);
}

HCVObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};


HCVObject.prototype.Infection= function (Year, GenotypeValue, Age, Alcohol, HCVParam ){
	
	
	this.Genotype[GenotypeValue]=1;
	
	if (this.Infected==0){//if not already infected (don't want to start fibrosis from f1)
		//State variables
		this.Infected=1;
		this.AntiBodies=1;
		
		//History variables
		this.InfectedYear=Year;
		this.AntiBodiesYear=Year;
		
		//Determine if spontaneous clearance occurs
		if (HCVParam.SpontaneousClearance>Math.random()){
			Math.random
		}
		
		
		//Determine time until Fibrosis
		//F0-F4 are mutually exclusive HCC and LF are non-mutually exclusive
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
