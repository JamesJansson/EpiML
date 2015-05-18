// Treatment scenarios

HCVTreatmentScenario=[];


HCVTreatmentScenario[0]={};
HCVTreatmentScenario[0].Name="Continued PEG-IFN 1000";
HCVTreatmentScenario[0].Description="This scenario continues what has been happening for some time in Australia: around 1000 treatments per year.";
HCVTreatmentScenario[0].Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat 1000 people
	
};

HCVTreatmentScenario[1]={};
HCVTreatmentScenario[1].Name="Sofosbuvir 1000";
HCVTreatmentScenario[1].Description="This scenario continues with the same rate of treatments, at around 1000 treatments per year, but changes the drug to Sofosbuvir.";
HCVTreatmentScenario[1].Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat 1000 people at random
	var NumTreatedThisStep=TimeStep*1000/Settings.SampleFactor;
};

HCVTreatmentScenario[2]={};
HCVTreatmentScenario[2].Name="Sofosbuvir 10%";
HCVTreatmentScenario[2].Description="This scenario changes the drug to Sofosbuvir and treats 10% of people per year.";
HCVTreatmentScenario[2].Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat 10% of people at random
	
};

HCVTreatmentScenario[3]={};
HCVTreatmentScenario[3].Name="Sofosbuvir Range";
HCVTreatmentScenario[3].Description="This scenario tests for a range of treatments levels. Param.HCV.Treatment.SofosbuvirNumberRange can be adjusted to allow different levels of treatment.";
HCVTreatmentScenario[3].Function=function (Person, Time, TimeStep){
	// find all infected, diagnosed individuals (that aren't previously treated)
	
	// treat range of people at random
	// Param.HCV.Treatment.SofosbuvirNumberRange
	// this is a number with a range between 0 and 10000
	var NumTreatedThisStep=TimeStep*Param.HCV.Treatment.SofosbuvirNumberRange/Settings.SampleFactor;
	
};



console.log("hcvtreatmentscenarios.js loaded");
