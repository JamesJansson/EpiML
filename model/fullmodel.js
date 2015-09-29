

var PostDataTreatmentFunction;// (Person[Array], Time, TimeStep)

// Put the following into the console
// RunSettings2={};
// RunSettings2.FunctionName="RunFullModel";
// RunSettings2.Common={};
// RunSettings2.Common.HCVTretmentFunctionID=Settings.HCVTreatmentScenario;
// RunSettings2.SimDataArray=[1];
// SimulationHolder.Run(RunSettings2);




// Put the following into the console
// RunSettingsEval={};
// RunSettingsEval.FunctionName="EvalText";
// RunSettingsEval.Common="console.log(SimulationResults)";
// RunSettingsEval.SimDataArray=[999];
// HCVOptSelector.SimulationHolder.Run(RunSettingsEval);




function CreateGlobalVariables(){
	// Globals that need to be run before code will work
	
}

function FullModelTest(WorkerData){

	throw "This throw is to prevent this function from executing.";
	
	
	//InSimFunction("This is the message");throw "stopping";
	
	// This should go into the outer loop

	
	
	
	
	
	
	
	
	
	// Set up the optimisation
	var DEOArray = HCVDataExtractionObjects();
	
	
	
	// This needs to be established by the optimisation 
	
	Param.HCV.PTransmission.IDU=0.15;
	// Param.IDU.TransmissionP=0.15;
	Param.IDU.NSP.P=0.3;
	Param.IDU.RateOfCesssation=0.10;

	Param.IDU.BecomeRegularInjector.P=0.50;

	Param.IDU.Entry.PeakEntryPerYear=500;
	Param.IDU.Entry.B=0.20;
	Param.IDU.Entry.Logk2=0.3;
	Param.IDU.Entry.Logk1=0.9;
	
	
	Param.IDU.Sexuality.Heterosexual=0.85;
	Param.IDU.Sexuality.Homosexual=0.077;
	Param.IDU.Sexuality.Bisexual=0.06;
	
	
	
	console.error("The above is hard set and poorly defined");
	
	
	// On the outside, when a calculation is performed, 
	function TransferIndividualOptimisationResults(SimulationHolder){
		function EnterDeeperLevel(SimObj, SummaryObject){
			for (var ObjName in SimObj){
				if (typeof(SimObj[ObjName])=="object"){
					// if it is not created already make a new object in SummaryObject to put sub objects in
					if (typeof(SummaryObject[ObjName])=="undefined"){
						SummaryObject[ObjName]={};
					}
					EnterDeeperLevel(SimObj[ObjName], SummaryObject[ObjName]);
				}
				else if (typeof(SimObj[ObjName])=="number"){
					// if it is not created alread make a new array in SummaryObject to put numbers in
					if (typeof(SummaryObject[ObjName])=="undefined"){
						SummaryObject[ObjName]=[];
					}
					SummaryObject[ObjName].push(SimObj[ObjName])
				}
			}
		};
		// Testing
		//var A=[];
		//A[0]={};
		//A[0].B = 3;
		//A[0].C = {};
		//A[0].C.D = 5;
		//A[0].C.E = 7;
		//A[1] = {};
		//A[1].B = 33;
		//A[1].C = {};
		//A[1].C.D = 55;
		//A[1].C.E = 77;
		//SumObj = {};
		//EnterDeeperLevel(A[0], SumObj);
		//EnterDeeperLevel(A[1], SumObj);
		// For each sim
		
		var SummaryOfOptimisations={};
		for (var OptCount in SimulationHolder.Results){
			EnterDeeperLevel(SimulationHolder.Results[OptCount].OptimisedParam, SummaryObject);
		}
	}
	console.error("The above code will transfered to the interface to transfer optimised parameters into the parameter interface.");
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var FullModelTimer=new RecordingTimer("FullModelTimer");
	FullModelTimer.Start();
	// Run the full model
	
	
	var FunctionInput={};
	FunctionInput.Notifications=Notifications;
	FunctionInput.EndSimulationTime=Param.Time.EndSimulation;
	FunctionInput.Intervention=Intervention;
	
	
	var FullModelResults=FullModel(FunctionInput);
	FullModelTimer.Stop();
	console.error("====================================");
	FullModelTimer.Display();

	
	var ErrorTimer=new RecordingTimer("ErrorTimer");
	ErrorTimer.Start();
	// Store a run for data as it would appear in the optimisation 
	var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, FullModelResults);
	console.error("The TotalOptimisationError is "+TotalOptimisationError);
	ErrorTimer.Stop();
	console.error("====================================");
	ErrorTimer.Display();
	
	
	
	
	
	// Find the data for the full set in which there are data points
	var TotalError=FindAllDEOError(DEOArray, FullModelResults);
	
	console.error("The total error is "+TotalError);
	console.log(DEOArray);
	
	
	// Generate graph data (external to the optimisation)
	RunAllDEOGenerateGraphData(DEOArray, FullModelResults);
	
	
	
	
	var ReturnResults={};
	// Store a run for data as it would appear in the optimisation 
	ReturnResults.DEOResultsArray=DEOArray;
	
	
	ReturnResults.HCVDataDiagnosisResults=FullModelResults.HCVDataDiagnosisResults;
	
	
	var StatsTime={};
	StatsTime.StartTime=1980;
	StatsTime.EndTime=2030;
	StatsTime.StepSize=1;
	
	
	var Person=FullModelResults.Population;
	
	ReturnResults.LivingWithHCVInfection=LivingWithHCVInfectionStats(Person, StatsTime);
	ReturnResults.CurrentIDU=CurrentIDUStats(Person, StatsTime);
	ReturnResults.EverIDU=EverIDUStats(Person, StatsTime);
	ReturnResults.EverIDUHCVAntibody=EverIDUHCVAntibodyStats(Person, StatsTime);
	ReturnResults.PWIDAge=PWIDAgeStats(Person, StatsTime);
	
	
	
	
	
	
	// Rearrange the 
	
	
	
	
	// console.log(SimulationHolder.Result[0].LivingWithHCVInfection.Count);
	// console.log(SimulationHolder.Result[0].CurrentIDU.Count);
	// console.log(SimulationHolder.Result[0].EverIDU.Count);
	// console.log(SimulationHolder.Result[0].EverIDUHCVAntibody.Count);
	// console.log(Divide(SimulationHolder.Result[0].EverIDUHCVAntibody.Count, SimulationHolder.Result[0].EverIDU.Count));
	
	
	// Note: number of people living with HCV is somewhat lower thant the people who have ever IDU	
	// console.log(Divide(SimulationHolder.Result[0].LivingWithHCVInfection.Count, SimulationHolder.Result[0].EverIDU.Count));
	
	// console.log(Person);

	
	return ReturnResults;
}







function CreateMigrantHCVCases(Population, Time){
	//var MigrantArray=[];
	
	var NumberOfMigrantsToAdd=MigrantRateFunction(Time);
	console.log("Migrants added this step:"+NumberOfMigrantsToAdd);
	
	
	// Age distribution by country 
	// Prevalence by country
	// Assume unifrom exposure by age in the population
	// That is, a person who comes in to Australia has an even probability of of being infected across all ages
	// the probability of it goes down by 75% after 1990
	
	for (var Count=0; Count<NumberOfMigrantsToAdd; Count++){
		var Sex, Sexuality;
		if (Rand.Value()<0.5){
			Sex=0;
			Sexuality=SexualitySelector.GeneralPopulation.Male.Select();
		}
		else{
			Sex=1;
			Sexuality=SexualitySelector.GeneralPopulation.Female.Select();
		}
		
		// 
		var AgeAtImmigration=MigrantAgeFunction();
		var TimeOfImmigration=Time+Rand.Value()*Param.TimeStep;
		
		var TimeOfBirth=TimeOfImmigration-AgeAtImmigration;
		console.log(TimeOfBirth);
		
		
		var PersonToAdd=new PersonObject(TimeOfBirth, Sex, Sexuality);
		
		var NationValue=1;// some other country code
		PersonToAdd.SetNationality(NationValue, TimeOfBirth);
		NationValue=0;// in country
		PersonToAdd.SetNationality(NationValue, TimeOfImmigration);
		
		
		// Create an HCV infection
		var AgeAtInfection=AgeAtImmigration*Rand.Value();
		
		var TimeOfInfection=TimeOfBirth+AgeAtInfection;
		
		var Genotype=1;//
		
		
		// console.log('Time:'+Time+' TimeOfBirth:'+TimeOfBirth+'AgeAtInfection:'+AgeAtInfection);
		PersonToAdd.HCV.Infection(TimeOfInfection,Genotype);	
		
		Population.push(PersonToAdd);
	}
	
}


function MigrantRateFunction(Time){
	var BaseYear=Data.GeneralPopulation.Year[0];
	if (Time<BaseYear){
		return 0;
	}
	
	var Index=Floor(Time-BaseYear);
	if (Index>=Data.GeneralPopulation.Year.length){
		Index=Data.GeneralPopulation.Year.length-1;
	}
	var PropWithHCV=0.02;
	return Round(PropWithHCV*Param.TimeStep*Data.GeneralPopulation.Migration[Index]/Settings.SampleFactor);
	
	// get migration by age rate
}

function MigrantAgeFunction(){
	var RateInPop=[64060,135270,166680,212480,400060,529630,512450,478990,495890,521250,485310,438830,446960,351080,283930,495320];
	var AgeArray=[0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75];
	
	var Age=RandSampleWeighted(RateInPop, AgeArray);
	Age+=Rand.Value()*5;// add a random value between 0 and 5 to evenly space 
	return Age;
}





function CreateMotherToChildCases(Population, Time){
	for (var PCount in Population){
		var Person=Population[PCount];
		if (Person.Sex==1){
			if (Person.HCV.CurrentlyInfected(Time)==true){
				if (Person.Alive(Time)==true){
					if (BirthRate.BirthOccurs(Person.Age(Time), Time, Param.TimeStep)){
						if (Rand.Value()<Param.HCV.PTransmission.MotherToChild){
							var TimeOfBirth=Time+Rand.Value()*Param.TimeStep;
							
							var Sex, Sexuality;
							if (Rand.Value()<0.5){
								Sex=0;
								Sexuality=SexualitySelector.GeneralPopulation.Male.Select();
							}
							else{
								Sex=1;
								Sexuality=SexualitySelector.GeneralPopulation.Female.Select();
							}
							
							var NewChild=new PersonObject(TimeOfBirth, Sex, Sexuality);
							// NewPerson.MotherID=Person.ID;
							// Set infection date to date of birth
							// Set genotype to mothers genotype
							NewChild.HCV.Infection(TimeOfBirth, Person.HCV.Genotype.Value(Time));
							
							Population.push(NewChild);
						}
					}
				}
			}
		}
	}
}




function SexualitySelectorClass(Rate){
	this.Heterosexual=Rate.Heterosexual;//1
	this.Homosexual=Rate.Homosexual;//2
	this.Bisexual=Rate.Bisexual;//3
}

SexualitySelectorClass.prototype.Select=function(){
	var Sexuality=RandSampleWeighted([this.Heterosexual, this.Homosexual, this.Bisexual], [1,2,3]);
	return Sexuality;
};
// Testing 
// SexualitySelector={};
// SexualitySelector.GeneralPopulation={};
// SexualitySelector.GeneralPopulation.Male=new SexualitySelectorClass(Param.Sexuality.GeneralPopulation.Male);
// SexualitySelector.GeneralPopulation.Female=new SexualitySelectorClass(Param.Sexuality.GeneralPopulation.Female);
// SexualitySelector.InjectingPopulation=new SexualitySelectorClass(Param.IDU.Sexuality);
// b=[0, 0, 0, 0];
// for (i=1; i<10000;i++){Sexuality=SexualitySelector.GeneralPopulation.Male.Select();b[Sexuality]++}



function FullModel(FunctionInput){ 
	
	// var Notifications=FunctionInput.Notifications;
	// var EndSimulation=FunctionInput.EndSimulationTime;
	// var Intervention=FunctionInput.Intervention;
	
	
	// type(FunctionInput.Intervention)==function


	// Set up the treatment function
	PostDataTreatmentFunction=HCVTreatmentScenario[Settings.HCVTreatmentScenario].Function;
	var Intervention=function(){};

	// Intervention[No]=function(Time){
	// 	   if (Time<2016){
	//         Param.HCV.TreatmentRate=1000;
	//     }else{
	//         Param.HCV.TreatmentRate=Min(1000+Time*5000, 20000);// increase at a rate of 5000 per year until reaching a max of 20000
	//     }
	// };
	
	
	// Set up some of the parameters
	RegularInjectionTime=new RegularInjectionTimeObject();
	
	BirthRate=new BirthRateClass(Data.Fertility.Data, Data.Fertility.YoungestAge, Data.Fertility.OldestAge, Data.Fertility.StartYear, Data.Fertility.EndYear);
	
	
	SexualitySelector={};
	SexualitySelector.GeneralPopulation={};
	SexualitySelector.GeneralPopulation.Male=new SexualitySelectorClass(Param.Sexuality.GeneralPopulation.Male);
	SexualitySelector.GeneralPopulation.Female=new SexualitySelectorClass(Param.Sexuality.GeneralPopulation.Female);
	SexualitySelector.InjectingPopulation=new SexualitySelectorClass(Param.IDU.Sexuality);
	
	
	
	// var PWIDPopulation=DistributePWIDPopulationExponential(Param.IDU.EntryParams);//Returns PWIDPopulation as defined to the MaxYear
	// this is probably antiquated var PWIDEntry=DeterminePWIDEntryRateExponential2(Param.IDU.EntryParams);//Returns PWIDPopulation as defined to the MaxYear
	
	
	
	
	
	
	
	// Add proportions as mentioned in Greg's paper
	// Determine how many end up as PWID
	// Run MSM
	// Run migrants
	// Determine proportion of each that end up PWID
	
	
	
	// Create a very basic early population that has a set distribution of IDU and HCV
	var Person=InitialDistribution();
	
	// Run HCV blood recipients
	console.error("Below is not running but should be implemented prior to creating results");
	//var HCVInfectedBloodRecipients=CreateHCVInfectedBloodRecipients();
	// Join populations
	// Person=Person.concat(HCVInfectedBloodRecipients);// Later add MSM and migrants
	

	var HCVDataDiagnosisResults=[];
	var StepCount=-1;
	
	console.error("fix times below");
	
	
	
	
	
	
	// // Set up timers
	// var TimerStart, TimerFinish;
	// var Timers={};
	// Timers.CreatePWID=new RecordingTimer("CreatePWID");
	// Timers.AssignSexualPartner=new RecordingTimer("AssignSexualPartner");
	// Timers.DetermineHCVTransmissions=new RecordingTimer("DetermineHCVTransmissions");
	
	var Time = Param.Time.StartDynamicModel;
	while(Time < Param.Time.EndSimulation){
		StepCount++;
		//console.log("Memory usage: ");
		//console.log(process.memoryUsage());
		

		
		
		// RunInterventions(Time); 
	
		
		//console.log(Time);
	
		// this is a function that will be called "AdvanceModel(YearLast, YearCurrent, Param, Population)
		// determine number of individuals added the population of PWID
		// Param.IDU.Add 
		
		// this is probably antiquated var NumberOfPeopleToAddThisStep=DeterminePWIDEntryRateExponential2(Param.IDU.EntryParams, Time, Param.TimeStep);
		
		// Add new people to the IDU population for this time step

		




    	// Timers.CreatePWID.Start();

		
		CreateMigrantHCVCases(Person,Time);
		
		CreateMotherToChildCases(Person, Time);
		
		
		
		
		var PWIDToAdd=CreatePWID(Param.IDU.Entry, Time, Param.TimeStep);
		
		// console.log("Outputting PWIDToAdd");
		// console.log(PWIDToAdd);
		// console.log("Outputting Param.IDU.Entry");
		// console.log(Param.IDU.Entry);
		// throw "Stopping to inspect Param.IDU.Entry";


		// Timers.CreatePWID.Stop();
		// Timers.CreatePWID.Display();
		
		
		if (Settings.ModelNetwork){
			if (false){// add once this section is complete
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
			}
		}
		
		
		Person=Person.concat(PWIDToAdd);
		
		
		
		
		

		
		
		
		if (Settings.ModelNetwork){
			// // Balance sexual partnerships
			// Timers.AssignSexualPartner.Start();
			AssignSexualPartner(Person, Time);
			// Timers.AssignSexualPartner.Stop();
			// Timers.AssignSexualPartner.Display();
		}
		else {
			// 
		}
		
		
		
		
		
		// Determine transmissions that occur
		// //if (Settings.ModelNetwork){
		// 	Timers.DetermineHCVTransmissions.Start();
			DetermineHCVTransmissions(Person, Time, Param.TimeStep);
			// Timers.DetermineHCVTransmissions.Stop();
			// Timers.DetermineHCVTransmissions.Display();
		//}
		//else {
			
		//}
		
		
		
		
		
		
		// Testing 
		if (Notifications.FirstYearOfData<=Time && Time+Param.TimeStep/100<Notifications.LastYearOfData){ // only if there is data
			var HCVDataDiagnosisResultsThisStep=HCVDataDiagnosis(Person, Notifications, Time, Param.TimeStep);
			HCVDataDiagnosisResults.push(HCVDataDiagnosisResultsThisStep);
		}
		else if (Notifications.LastYearOfData < Time){
			if (typeof(PerStepProbOfDiagnosis)=="undefined"){
				var PerStepProbOfDiagnosis=DeterminePostDataDiagnosisDataRate(HCVDataDiagnosisResults, Notifications.LastYearOfData-Param.Time.DurationToAverageOver);
			}
			HCVRateDiagnosis(Person, Notifications.Age, PerStepProbOfDiagnosis, Time, Param.TimeStep);
		}
		
		
		// Determine treatment
			// X number per year are treated out of those who are diagnosed
		if (Time+Param.TimeStep/100<Param.Time.EndTreatmentData){
			DetermineHistoricalTreatment(Person, Time, Param.TimeStep, Data.TreatmentNumbers);//Treatment rates is an array of each of the treatment types
		}
		else{
			PostDataTreatmentFunction(Person, Time, Param.TimeStep);	
		}
		
		
		
		// console.log("Time: "+Time+ "People: "+Person.length);
		
		
		
		
		
		
		
		// lots of points are lost for insufficient people to draw from diagnoses 
		
		
		// If the year is the first year of the simulation
			// Give the injecting
		


		
		
		
		// HCV testing
		// Param.HCV.TestingRate from NSP survey
		
		// Treatment
		
		// HCV mortality
		
		Time += Param.TimeStep;
	}
	
	// 
	
	
	
	// Create HCV notification population
	
	// Match to population (including choosing individuals that are not diagnosed by the end of the data)
	// Assign dates to those with diagnoses
	// In the first year that you have results
		// Find the number of diagnoses in the earlier model
		// For every diagnosis, 
	

	
	
	var Results={};
	Results.Population=Person;
	Results.HCVDataDiagnosisResults=HCVDataDiagnosisResults;
	
	// Summarise the HCVDataDiagnosisResults in to results by 
	
	
	
	
	
	
	DetermineAverageInjectingDuration(Person);
	
	
	return Results;
}

function InitialDistribution() {
	console.log("Starting InitialDistribution");
	// Run CreatePWID multiple times
	var Person = [];
	
	
	var Time = Param.Time.StartNonDynamicModel;
	while(Time+Param.TimeStep/100 < Param.Time.StartDynamicModel){// used to prevent errors in the timestep
		var PWIDToAdd = CreatePWID(Param.IDU.Entry, Time, Param.TimeStep);
		Person = Person.concat(PWIDToAdd);
		Time += Param.TimeStep
	}
	
	SetInitialHCVLevels(Person);
	//InitialiseNetwork(Person, Param.Time.StartDynamicModel);// we only need it to be a correct network at the end of this period because this is the start of the dynamic period
	
	return Person;
}



function DetermineAverageInjectingDuration(Person){
	var InjectionDuration=[];
	var EverInjected=0;
	var RecentInjected=0;
	for (var Pn in Person){
		// Determine if the person is ever an injector
		if (Person[Pn].IDU.EverInjectedAtTime(2013)){
			EverInjected++;
			if (Person[Pn].IDU.InjectedBetween(2012, 2013)){
				RecentInjected++;
			}
			InjectionDuration.push(Person[Pn].IDU.InjectingDuration());
		}
	}
	console.log("EverInjected: "+EverInjected);
	console.log("RecentInjected: "+RecentInjected);
	console.log("Mean: "+Mean(InjectionDuration));
	console.log("Median: "+Median(InjectionDuration));
	console.log("25%: "+Percentile(InjectionDuration, 25));
	console.log("75%: "+Percentile(InjectionDuration, 75));
	
	
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
	
	return 0;
	
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

