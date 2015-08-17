// Treatment scenarios

var HCVTreatmentScenario=[];

var HCVTS;

HCVTS={};
HCVTS.Name="Continued PEG-IFN 1000";
HCVTS.Description="This scenario continues what has been happening for some time in Australia: around 1000 treatments per year.";
HCVTS.Function=function (Person, Time, TimeStep){
	// Treat 1000 people
	var NumberOfPeopleToTreatPerYear=1000;
	var NumberOfPeopleToTreat=NumberOfPeopleToTreatPerYear*TimeStep;
	
	// find all infected, diagnosed individuals (that aren't previously treated)
	var CurrentlyInfected=[];
	for (var PCount in Person){
		if (Person[PCount].HCV.CurrentlyInfected(Time)==true){
			CurrentlyInfected.push(Person[PCount]);
		}
	}

	var NumberCurrentlyInfected=CurrentlyInfected.length;
	var ArrayToTreat=RandomSelection(NumberOfPeopleToTreat, NumberCurrentlyInfected);
	
	for (var Count in ArrayToTreat){
		var TimeToTreat=Time+Rand.Value()*TimeStep;
		var IndividualToTreat=ArrayToTreat[Count];
		Treatment.PegIfn.StartTreatment(CurrentlyInfected[IndividualToTreat], TimeToTreat);
	}
};
HCVTreatmentScenario[0]=HCVTS;

HCVTS={};
HCVTS.Name="Sofosbuvir 1000";
HCVTS.Description="This scenario continues with the same rate of treatments, at around 1000 treatments per year, but changes the drug to Sofosbuvir.";
HCVTS.Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat 1000 people at random
	var NumTreatedThisStep=TimeStep*1000/Settings.SampleFactor;
};
HCVTreatmentScenario[1]=HCVTS;

HCVTS={};
HCVTS.Name="Sofosbuvir 10%";
HCVTS.Description="This scenario changes the drug to Sofosbuvir and treats 10% of people per year.";
HCVTS.Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat 10% of people at random
	
};
HCVTreatmentScenario[2]=HCVTS;

HCVTS={};
HCVTS.Name="Sofosbuvir Range";
HCVTS.Description="This scenario tests for a range of treatments levels. Param.HCV.Treatment.SofosbuvirNumberRange can be adjusted to allow different levels of treatment.";
HCVTS.Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat range of people at random
	// Param.HCV.Treatment.SofosbuvirNumberRange
	// this is a number with a range between 0 and 10000
	var NumTreatedThisStep=TimeStep*Param.HCV.Treatment.SofosbuvirNumberRange/Settings.SampleFactor;
	
};
HCVTreatmentScenario[3]=HCVTS;



console.log("hcvtreatmentscenarios.js loaded");
