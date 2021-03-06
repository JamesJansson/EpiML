function  HCVObject(PersonPointer){
	this.Person=PersonPointer;
	
	//this.Active={};//indicates whether the HCV module is active or not 
	
	//State variables
	this.InfectedState=0;
	this.AntibodyState=0;
	this.DiagnosedState=0;

	
	
	
	//History variables
	this.Infected=new EventVector; // 0= unifected 1= infected
	this.AntibodyYear=NaN;
	this.Diagnosed=new EventVector;
	//AntibodyDiagnosis
	this.Fibrosis=new EventVector;//including liver failure
	this.HCC=new EventVector;
	this.Genotype=new EventVector; // an array that holds all current genotypes
	
	
	

	
	
	//Initialise history variables
	this.Infected.Set(0, this.Person.YearOfBirth);
	this.Diagnosed.Set(0, this.Person.YearOfBirth);
	this.Fibrosis.Set(0, this.Person.YearOfBirth);
	this.HCC.Set(0, this.Person.YearOfBirth);
	// Set the genotype to an empty array at birth. To add a new 
	this.Genotype.Set([], this.Person.YearOfBirth);
	

	
	//Cascade of care
    this.Assessment=new EventVector;//
    this.Fibroscan=new EventVector;
	this.Biopsy=new EventVector;
	this.UltraSound=new EventVector;
	this.Treatment=new EventVector;
	
	this.Treatment.Set(0, this.Person.YearOfBirth);
	
	this.TreatmentCosts=new EventVector;
	this.TreatmentCosts.Set(0, this.Person.YearOfBirth);
	
	// Determine if the person is a reinfection protected
	if (Rand.Value()<Param.HCV.PReinfectionProtected){
		this.ReinfectionProtected=true;
	}
	else{
		this.ReinfectionProtected=false;
	}
}

HCVObject.prototype.AntibodyPresent= function (Time){
	if (!isNaN(this.AntibodyYear)){// if it has been set
		if (this.AntibodyYear<Time){
			return true;
		}
	}
	return false;
};


HCVObject.prototype.Infection= function (TimeOfInfection, GenotypeValue){//, Age, Sex, Alcohol, HCVParam ){
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
	if (this.AntibodyPresent(TimeOfInfection)){// if it has been set
		if (this.ReinfectionProtected==true){
			return 0;
		}
		
	}
	

	// Convert the genotype to an array	
	if (typeof(GenotypeValue)!="object"){
		GenotypeValue=[GenotypeValue];
	}

	// Superinfection is common, so we assume all people who get infected with a second strain are infected again http://www.cdc.gov/hepatitis/Resources/MtgsConf/HCVSymposium2011-PDFs/20_Blackard.pdf 
	// Super infection does not change the course of Fibrosis in the model
	
		
	// var OriginalGenotypeArray=DeepCopy(this.Genotype.Value(TimeOfInfection));// note that since this is an array, we need to copy it before we operate on it.
	var OriginalGenotypeArray=this.Genotype.Value(TimeOfInfection);// we are not operating on this, so no need to copy

	if (isNaN(OriginalGenotypeArray)){
		console.error("Trace of problem.");
		throw "It appears that the date of infection is prior to the date of birth of the individual."
	}

	// determine the potential new genotype	
	var NewGenotypeArray=OriginalGenotypeArray.concat(GenotypeValue);;
	
	// Check if any of the Genotypes in GenotypeValue exist in the current array
	var UniqueGenotypeArray = NewGenotypeArray.filter(function(item, pos, self) {
		return self.indexOf(item) == pos;// if the item under inspection is equal to the first occurrence of the item, then keep
	});

	// If the new array not is identical to the old, add to the history of genotypes
	if (!(ArraysEqual(UniqueGenotypeArray, OriginalGenotypeArray))){
		this.Genotype.Set(UniqueGenotypeArray, TimeOfInfection);
	}
	
	
	
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
		this.Infected.Set(1, TimeOfInfection);
		if (isNaN(this.AntibodyYear)){// if it has not been set
			this.AntibodyYear=TimeOfInfection;
		}
		
		//Determine if spontaneous clearance occurs
		if (Rand.Value()<Param.HCV.SpontaneousClearance.p){
			var TimeUntilClearance=ExpDistributionRand(Param.HCV.SpontaneousClearance.MedianTime);
			this.Infected.Set(0, TimeOfInfection+TimeUntilClearance);
			this.Genotype.Set([], TimeOfInfection+TimeUntilClearance);
		}
		else {//progress to fibrosis
			var Time;
			//Determine time until Fibrosis
			//F0-F4-LF are mutually exclusive, HCC is not mutually exclusive to the other states
			//F0F1
			
			// determine the level of Fibrosis, and start from that level. 
			
			Time=TimeUntilEvent(Param.HCV.F0F1);
			var DateF1=TimeOfInfection+Time;
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
			this.Person.Death.Set('HCV', DateHCVDeath);

			
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




HCVObject.prototype.CurrentlyInfected= function (Time){
	if (this.Infected.Value(Time)==1){
		return true;
	}
	return false;
};

HCVObject.prototype.L4ToHCCTime= function (Param){
	// Degos et al. produced probability with time curves
	//http://www.ncbi.nlm.nih.gov/pubmed/10861275

	// for the first 2 years, there is no chance of HCC. 
	
	// probability of HCC increases from 0 at second year, to 0.35 at the 8th year in a linear fashion
	
	// from 8th year onwards, assume a flat rate
	
	
	
};


HCVObject.prototype.Diagnose= function (Time){
	if (Time<this.Person.Death.Time()){// Make sure that the diagnosis date is prior to death. Otherwise it is not discovered
		this.Diagnosed.Set(1, Time);
	}
	// Below here we put further information, such as
	// a probability that a genotyping occurs
	// a probability that an assessment occurs
};

HCVObject.prototype.Treatment= function (TimeOfTreatment, TreatmentType){
	throw "This function is no longer in use. Treatment now runs as its own independent system.";
	 
	// Show on the person that treatment is occurring
	this.Treatment.Set(TreatmentType.ID, TimeOfTreatment);
	var TreatmentStopDate=TimeOfTreatment+TreatmentType.Duration;
	this.Treatment.Set(0, TimeOfTreatment+TreatmentType.Duration);
	
	// Get the genotype combination at this point time
	var GenotypeArray=this.Genotype.Value(Year);
	var PClearanceArray=[];
	for (var GenotypeCount in GenotypeArray){
		var GenotypeName="Genotype"+GenotypeArray[GenotypeCount];
		if (typeof(TreatmentType.PClearance[GenotypeName])!="undefined"){
			PClearanceArray.push(TreatmentType.PClearance[GenotypeName]);
		}
		else{
			// if PClearance undefined use numerical genotype
			var GenotypeName="Genotype"+GenotypeName.charAt(0);
			PClearanceArray.push(TreatmentType.PClearance[GenotypeName]);
		}
	}	
	// If the person is multiply infected, choose the lowest efficacy genotype
	var MinPClearance=Min(PClearanceArray);
	
	
	// Determine if clearance occurs
	if (Rand.Value()<MinPClearance){
		// If cleared change future history of HCV
		// HCV.TreatmentClearance(TreatmentStopDate)
		
		// Determine retraction of liver disease
		var CurrentFibrosis=this.Fibrosis.Get(TimeOfTreatment);
		if (CurrentFibrosis.Value>=4){ // what happens if it is level 5 (fibrosis)
			// Choose a random time until exiting stage 4 fibrosis
			// We'll choose a random time between the equivalent taking a whole stage change and a partial stage change to exit
			// In doing this it will give between 0 and about 2 years until movement out of the F4 to F3 fibrosis levels based on a 0.5 per year stage transition rate
			var YearBelowF4=TimeOfTreatment+Rand.Value()/Param.HCV.FibrosisReversalRate;
			// Once we determine when the retraction to fibrosis level 3 occurs, we'll look at if there are HCC, HCV death, and LF that occurs later
			this.Fibrosis.Set(3, YearBelowF4);
			
			var ThisFibrosisLevel=3;
			var ThisFibrosisYear=YearBelowF4;
		}
		else{
			var YearBelowF4=TimeOfTreatment;
			
			// Check for partially advanced stages
			if (CurrentFibrosis.Value>=1){
				var NextFibrosis=this.Fibrosis.Next(TimeOfTreatment);
				// Find the percentage of the amount of time through this stage
				var PercentThroughFibrosisStage=(TimeOfTreatment-CurrentFibrosis.Time)/(NextFibrosis.Time-CurrentFibrosis.Time);
				var TimeUntilReachingPreviousFibrosisLevel=PercentThroughFibrosisStage/Param.HCV.FibrosisReversalRate;
				
				var ThisFibrosisLevel=CurrentFibrosis.Value-1;
				var ThisFibrosisYear=TimeOfTreatment+TimeUntilReachingPreviousFibrosisLevel;
				
				this.Fibrosis.Set(ThisFibrosisLevel, ThisFibrosisYear);
			}
			else{// if it is F0
				var ThisFibrosisLevel=0;
				var ThisFibrosisYear=CurrentFibrosis.Time;
			}
		}
		
		// for each of the remain steps, calculate when the reversal will occur 
		while (ThisFibrosisLevel>0){
			ThisFibrosisYear=ThisFibrosisYear+1/Param.HCV.FibrosisReversalRate;
			ThisFibrosisLevel=ThisFibrosisLevel-1;
			this.Fibrosis.Set(ThisFibrosisLevel, ThisFibrosisYear);
		}
		
		// Remove HCV related future death
		if (YearBelowF4<this.Person.Death.Time('HCV')){
			this.Person.Death.Reset('HCV');
		}
		if (YearBelowF4<this.Person.Death.Time('LF')){
			this.Person.Death.Reset('LF');
		}
		
		// Remove HCV related future HCC
		if (this.HCC.Next(YearBelowF4)==1){// find the next case of HCC after going below F4
			this.HCC.DeleteFutureEvents(YearBelowF4);// this should remove future cases of HCC
			if (YearBelowF4<this.Person.Death.Time('HCC')){
				this.Person.Death.Reset('HCC');
			}
		}
	}
}

HCVObject.prototype.Clearance= function (TimeOfClearance){
	// Set HCV genotype to empty
	this.Genotype.Set([], TimeOfClearance);
	
	// Determine retraction of liver disease
	var CurrentFibrosis=this.Fibrosis.Get(TimeOfClearance);
	if (CurrentFibrosis.Value>=4){ // what happens if it is level 5 (fibrosis)
		// Choose a random time until exiting stage 4 fibrosis
		// We'll choose a random time between the equivalent taking a whole stage change and a partial stage change to exit
		// In doing this it will give between 0 and about 2 years until movement out of the F4 to F3 fibrosis levels based on a 0.5 per year stage transition rate
		var TimeOfBeingBelowF4=TimeOfClearance+Rand.Value()/Param.HCV.FibrosisReversalRate;
		// Once we determine when the retraction to fibrosis level 3 occurs, we'll look at if there are HCC, HCV death, and LF that occurs later
		this.Fibrosis.Set(3, TimeOfBeingBelowF4);
		
		var ThisFibrosisLevel=3;
		var ThisFibrosisYear=TimeOfBeingBelowF4;
	}
	else{
		var TimeOfBeingBelowF4=TimeOfClearance;
		
		// Check for partially advanced stages
		if (CurrentFibrosis.Value>=1){
			var NextFibrosis=this.Fibrosis.Next(TimeOfClearance);
			// Find the percentage of the amount of time through this stage
			var PercentThroughFibrosisStage=(TimeOfClearance-CurrentFibrosis.Time)/(NextFibrosis.Time-CurrentFibrosis.Time);
			var TimeUntilReachingPreviousFibrosisLevel=PercentThroughFibrosisStage/Param.HCV.FibrosisReversalRate;
			
			var ThisFibrosisLevel=CurrentFibrosis.Value-1;
			var ThisFibrosisYear=TimeOfClearance+TimeUntilReachingPreviousFibrosisLevel;
			
			this.Fibrosis.Set(ThisFibrosisLevel, ThisFibrosisYear);
		}
		else{// if it is F0
			var ThisFibrosisLevel=0;
			var ThisFibrosisYear=CurrentFibrosis.Time;
		}
	}
	
	// for each of the remain steps, calculate when the reversal will occur 
	while (ThisFibrosisLevel>0){
		ThisFibrosisYear=ThisFibrosisYear+1/Param.HCV.FibrosisReversalRate;
		ThisFibrosisLevel=ThisFibrosisLevel-1;
		this.Fibrosis.Set(ThisFibrosisLevel, ThisFibrosisYear);
	}
	
	// Remove HCV related future death
	if (TimeOfBeingBelowF4<this.Person.Death.Time('HCV')){
		this.Person.Death.Reset('HCV');
	}
	if (TimeOfBeingBelowF4<this.Person.Death.Time('LF')){
		this.Person.Death.Reset('LF');
	}
	
	// Remove HCV related future HCC
	if (this.HCC.Next(TimeOfBeingBelowF4)==1){
		this.HCC.DeleteFutureEvents(TimeOfBeingBelowF4);// this should remove future cases of HCC
		if (TimeOfBeingBelowF4<this.Person.Death.Time('HCC')){
			this.Person.Death.Reset('HCC');
		}
	}
	
	// Remove HCV related future liver disease advancement
	
	// this.LF.DeleteFutureEvents(Year);
	
	// find all future deaths due to HCV and adjust/cancel them
		
	
};


HCVObject.prototype.UndiagnosedHCVInfection= function (Time){
	if (this.Infected.Value(Time)==1 && this.Diagnosed.Value(Time)==0){
		return true;
	}
	return false;
};


HCVObject.prototype.UndiagnosedHCVAntibody= function (Time){
	if (Time>this.AntibodyYear && this.Diagnosed.Value(Time)==0){
		return true;
	}
	return false;
};




HCVObject.prototype.UndiagnosedHCC= function (Time){
	
};

HCVObject.prototype.UndiagnosedDecompensatedCirrhosis= function (Time){
	
};





HCVObject.prototype.Status= function (Year){//returns all the relevant information from this year (infection status, genotype, diagnosis status, treatment etc)


};




console.log("Loaded hcv.js");


