
var RegularInjectionTime;

// Put the following into the console
// RunSettings2={};
// RunSettings2.FunctionName="RunFullModel";
// SimulationHolder.Run(RunSettings2);


function RunFullModel(){
	
	var Results=FullModel(Param, Data, Intervention);
	return Results;
}


function FullModel(Param, Data, Intervention){ 
	var YearToStartAverage=2008;
	console.error("Warning: year to start average diagnosis rate is hard set here");

	// Intervention[No]=function(Time){
	// 	   if (Time<2016){
	//         Param.HCV.TreatmentRate=1000;
	//     }else{
	//         Param.HCV.TreatmentRate=Min(1000+Time*5000, 20000);// increase at a rate of 5000 per year until reaching a max of 20000
	//     }
	// };
	
	
	// Set up some of the parameters
	RegularInjectionTime=new RegularInjectionTimeObject();
	
	// Notification data
	var Notifications={}; // This should go into the outer loop
	Notifications.Year=Data.MaleNotifications.Year;
	Notifications.Age=Data.MaleNotifications.Age;
	Notifications.Table=[];
	Notifications.Table[0]=[];
	Notifications.Table[0]=Data.MaleNotifications.Table;
	Notifications.Table[1]=[];
	Notifications.Table[1]=Data.FemaleNotifications.Table;
	
	// var PWIDPopulation=DistributePWIDPopulationExponential(Param.IDU.EntryParams);//Returns PWIDPopulation as defined to the MaxYear
	// this is probably antiquated var PWIDEntry=DeterminePWIDEntryRateExponential2(Param.IDU.EntryParams);//Returns PWIDPopulation as defined to the MaxYear
	
	
	
	
	
	
	
	// Add proportions as mentioned in Greg's paper
	// Determine how many end up as PWID
	// Run MSM
	// Run migrants
	// Determine proportion of each that end up PWID
	
	
	
	var Population=[];
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Create a very basic early population that has a set distribution 
	var Person=InitialDistribution();
	
	// Run HCV blood recipients
	console.error("Below is not running but should be implemented prior to creating results");
	//var HCVInfectedBloodRecipients=CreateHCVInfectedBloodRecipients();
	// Join populations
	// Person=Person.concat(HCVInfectedBloodRecipients);// Later add MSM and migrants
	
	var SimulationHistory=[];
	SimulationHistory.DiagnosisResults=[];
	var StepCount=-1;
	for (var Time=Param.StartTime; Time<Param.EndTime; Time+=Param.TimeStep){// each time step
		StepCount++;
		// RunInterventions(Time); 
	
		// this is a function that will be called "AdvanceModel(YearLast, YearCurrent, Param, Population)
		// determine number of individuals added the population of PWID
		// Param.IDU.Add 
		
		// this is probably antiquated var NumberOfPeopleToAddThisStep=DeterminePWIDEntryRateExponential2(Param.IDU.EntryParams, Time, Param.TimeStep);
		
		// Add new people to the IDU population for this time step
		var PWIDToAdd=CreatePWID(Param.IDU.EntryParams, Time, Param.TimeStep);
		
		// Match some of the PWID, in particular females, to existing PWID sexual partners
		// select by finding ProportionOfFirstInjectionsSexualPartner

		
		// determine the number that will inject the first time with a sexual partners
		var RemainderToAdd=JoinToSexualPartners(Person, PWIDToAdd, Data.FirstExperienceSexualPartner.Male, Data.FirstExperienceSexualPartner.Female);
			// determine number with regular sex partners (approximately 50%, NSP survey)
			// determine number with casual sex partners
			// Determine when the sexual partners begin their partnership (could be before starting injecting or after)
			// what proportion had partners who did not inject drugs
		
		// not the above should add the correct number of PWID to Person
		
		// All new people are joined to "friends" in the model
		JoinToFriends(Person, RemainderToAdd);
		
		// Balance sexual partnerships
		AssignSexualPartner(Person, Time);
		
		// Determine transmissions that occur
		DetermineHCVTransmissions(Person, Time, Param.TimeStep);
		
		
		// Testing
		if (Time<Common.LastYearOfHCVDiagnosisData){
			SimulationHistory.DiagnosisResults[StepCount]=HCVDataDiagnosis(Person, Notifications, Time, Param.TimeStep);
		}
		else{
			if (typeof(PerStepProbOfDiagnosis)=="undefined"){
				var PerStepProbOfDiagnosis=DeterminePostDataDiagnosisDataRate(SimulationHistory.DiagnosisResults, YearToStartAverage);
			}
			HCVRateDiagnosis(Person, PerStepProbOfDiagnosis, Time, Param.TimeStep);
		}
		
		
		// Determine treatment
			// X number per year are treated out of those who are diagnosed
		if (Time<Common.LastYearOfHCVDiagnosisData){
			DetermineHistoricalTreatment(Person, Time, Param.TimeStep, TreatmentNumbers);//Treatment rates is an array of each of the treatment types
		}
		else{
			TreatmentFunction(Person, Time, Param.TimeStep);	
		}
		
		
		// lots of points are lost for insufficient people to draw from diagnoses 
		
		
		// If the year is the first year of the simulation
			// Give the injecting
		


		
		
		
		// HCV testing
		// Param.HCV.TestingRate from NSP survey
		
		// Treatment
		
		// HCV mortality
		
		
	}
	
	// 
	
	
	
	// Create HCV notification population
	
	// Match to population (including choosing individuals that are not diagnosed by the end of the data)
	// Assign dates to those with diagnoses
	// In the first year that you have results
		// Find the number of diagnoses in the earlier model
		// For every diagnosis, 
	
	var Results={};
	Results.Population=Population;
	Results.UnaccountedForDiagnoses=UnaccountedForDiagnoses;
	
	return Results;
}

function InitialDistribution(){
	// Run CreatePWID multiple times
	var Person=[];
	for (var Time=Param.Time.StartNonDynamicModel; Time<Param.Time.StartDynamicModel; Time+=Param.TimeStep){
		var PWIDToAdd=CreatePWID(Param.IDU.EntryParams, Time, Param.TimeStep);
		Person=Person.concat(PWIDToAdd);
	}
	SetInitialHCVLevels(Person);
	InitialiseNetwork(Person, Param.Time.StartDynamicModel);// we only need it to be a correct network at the end of this period because this is the start of the dynamic period
	
	return Person;
}




function SetInitialHCVLevels(Person){
	var Time=1993;//Param.Model.DynamicHCV.Time;
	var PropWithHCVInitially=0.7; //Param.InitialHCV.Prop;
	var PWID=SelectPWID(Person, Time);
	
	var InjectionHistory={};
	InjectionHistory.Duration=[];
	InjectionHistory.TimeStart=[];
	for (var Pn in PWID){
		var ThisTimeStartInjection=PWID[Pn].IDU.Use.FirstTimeOf(1);	
		InjectionHistory.TimeStart.push(ThisTimeStartInjection);
		InjectionHistory.Duration.push(Time-ThisTimeStartInjection);
	}
	// do a very rough optimisation to get the right proportion at the time

	var FunctionInput=InjectionHistory;
	var OptimisationSettings={};
	OptimisationSettings.Target=PropWithHCVInitially;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		var TotalIDU=0;
		var TotalHCV=0;
		for (var Pn in FunctionInput.Duration){
			TotalIDU++;
			var TimeOfHCV=TimeUntilEvent(ParameterSet.AnnualPHCV);
			if (TimeOfHCV<FunctionInput.Duration[Pn]){
				TotalHCV++;
			}
		}
		var Results=TotalHCV/TotalIDU;
		return Results;
	};

	OptimisationSettings.ErrorFunction=function(Results, Target){
		var TotalError=Abs(Results-Target);
		return TotalError;
	};

	
	//OptimisationSettings.MaxTime=10;//stop after 10 seconds
	OptimisationSettings.NumberOfSamplesPerRound=10;
	OptimisationSettings.MaxIterations=10;
	
	var HCVPOptimisation=new StochasticOptimisation(OptimisationSettings);
	HCVPOptimisation.AddParameter("AnnualPHCV", 0, 1);
	HCVPOptimisation.Run(FunctionInput);
	
	console.log(HCVPOptimisation);
	
	console.log(Mean(InjectionHistory.Duration));
	
	var AnnualPHCV=HCVPOptimisation.ParameterFinal.AnnualPHCV;
	// Now apply this to all people in the simulation thus far
	for (var Pn in PWID){
		var TimeOfHCV=TimeUntilEvent(AnnualPHCV);
		if (TimeOfHCV<InjectionHistory.Duration[Pn]){
			PWID[Pn].HCV.Infection(InjectionHistory.TimeStart[Pn]+TimeOfHCV, ChooseInitialGenotype());
		}
	}
	console.log(PWID);
	
	// At this point, a plot should be created of 
		// PWID by year
		// HCV infections by year
	
	
}

function ChooseInitialGenotype(){
	// the intention of this function is to set the genotype in the proportions stated
	
	// weightedrand([0.2, 0.3, 0.4], ['1a', '1b', '2'])
	
	return '1';
}




//function PWIDInitialDistribution(){
//	var Population=[];
	
//	Param.InitialDistribution.AgePWID.Median=35;
//	Param.InitialDistribution.AgePWID.LogSD=0.17;
	
//	Param.InitialDistribution.AgeInitiatePWID.Median=20;
//	Param.InitialDistribution.AgeInitiatePWID.Median=20;
	
	
//	Param.InitialDistribution.TimeUntilHCV.Median=3.5;
//	Param.InitialDistribution.TimeUntilHCV.LogSD=1;
	
//	Param.InitialDistribution.Year=1980;// this can vary too!
//	return Population;
//}





function CreateHCVInfectedBloodRecipients(){
	Param.Haemophilia.Total2013;
	// Data.Population.Total
	// Data.Population.Migration
	// Data.Population.Deaths
	// Data.Population.Births
	
	// THIS MUST BE MOVED TO THE INTERFACE
	Data.GeneralPopulation={};
	Data.GeneralPopulation.Year=DataFile.GeneralPopulation.GetColumn(0, 1, 43);
	Data.GeneralPopulation.Size=DataFile.GeneralPopulation.GetColumn(1, 1, 43);
	Data.GeneralPopulation.Births=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Migration=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Deaths=DataFile.GeneralPopulation.GetColumn(3, 1, 43);
	
	
	//Determine total population by year
	
	//Interpolate to get number of new cases per year
	
	
	

	// Create a distribution which is based on 10000 samples
	// Roughly add to the 
	// Age them
	// This is the starting age distribution
	// Randomly assign people with HCV or not
	
	
	
	// 
	
	Param.Haemophilia.HCV.Prevalence1973;
	Param.Haemophilia.HCV.Prevalence1980;
	Param.Haemophilia.HCV.Prevalence1990;
	
	Param.HCV.Prevalence.Haemophiliacs1960;
	
	return
	
}


function ErrorOfFullModel(){
	// Error categories:
	// Ever injected
	// Recently injected
	// Ratio of standard deviation to the mean is basically the same in recent injectors over time (last x years)
	// Error of difference between diagnosed data and undiagnosed
	//
}


function RunAndLink(){
	// this is the final step before a normal run of the model occurs
	
	// Run the model with optimised parameters, but this time with double (?) the number of individuals 
		// starting injecting
		// treatment numbers
		// 

	// Create a table that determines the diagnoses by year, age and sex (later state)
		// Store this table for error analyses later
	
	// sort the diagnoses by year, age and sex (later state)
	// Initialise object
		// Ind=DetermineIndicies(SimPerson);
		// determine sexindex
		// determine yearindex
		// determine ageindex
		PopRef[Ind.Sex][Ind.Year][Ind.Age].listpeople.push(i);
	
	// Convert ALL diagnoses in the model to real diagnoses
	// i.e. notification cases
	// for each notification
		Ind=DetermineIndicies(NotificationPerson);
		// choose a diagnosis that matches it in terms of sex and age
		NumInArray=PopRef[Ind.Sex][Ind.Year][Ind.Age].listpeople.length;
		// If no available individual remaining
		// may choose the same diagnosis multiple times but it MUST be duplicated using DeepCopy
		
		// If none available in category of diagnoses
			// may choose nearest neighbour
		
	// determine difference 
		
	
	// Delete all un-matched diagnoses
	
	// Randomly remove undiagnosed individuals in the model at the same proportion as 
}

