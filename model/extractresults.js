// Functions to be added to this section
// A function that runs through each summary stat for counting in a simulation
	// Input is the array of selection functions 
// A function that runs through each summary stat for aggregation (check that it isn't made already)
	// Input is the array of results from the simulation
// A function that links summary stats to plots

// Statistic
	// Selection function
	// Settings
	// A graph function










function FibrosisCount(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of People by Fibrosis Level";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.MultipleCategories=true;
	StatSettings.NumberOfCategories=8;	
	
	StatSettings.Time=Time;
	

	
	// Define the  category description
	StatSettings.CategoryLabel=[];
	StatSettings.CategoryLabel[0]="F0";
	StatSettings.CategoryLabel[1]="F1";
	StatSettings.CategoryLabel[2]="F2";
	StatSettings.CategoryLabel[3]="F3";
	StatSettings.CategoryLabel[4]="F4";
	StatSettings.CategoryLabel[5]="Liver Failure";
	StatSettings.CategoryLabel[6]="HCC";
	StatSettings.CategoryLabel[7]="Antibody positive, cleared";
	
	//Define the selection function
	var FibrosisFunction= function (Person, Year){
		if (Person.Alive(Year)==true){
			var InfectionStatus=Person.HCV.Infected.Value(Year);
			if (InfectionStatus==1 && Person.HCV.HCC.Value(Year)!=1){//currently infected
				return Person.HCV.Fibrosis.Value(Year); // in this case, the returned value is the numerical value found in the 
			}
			else if (Person.HCV.AntibodyYear<=Year && Person.HCV.HCC.Value(Year)==1){
				return 6;
			}
			else if (Person.HCV.AntibodyYear<=Year){// not currently infected, but was previously infected
				return 7;
			}
		}
		return NaN;
	};
	
	
	
	
	// Run the statistic
	var FibrosisResult=new CountStatistic(StatSettings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	
	FibrosisResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return FibrosisResult;
}



function LivingDxAndUDx(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of people living with diagnosed and undiagnosed HCV";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.Time=Time;
	
	StatSettings.MultipleCategories=true;
	StatSettings.NumberOfCategories=4;
	
	// Define the  category description
	StatSettings.CategoryLabel=[];
	StatSettings.CategoryLabel[0]="Undiagnosed & infected";
	StatSettings.CategoryLabel[1]="Diagnosed & infected";
	StatSettings.CategoryLabel[2]="Undiagnosed, uninfected & antibody+";
	StatSettings.CategoryLabel[3]="Diagnosed, uninfected & antibody+";
	
	//Define the selection function
	var DiagnosisFunction= function (Person, Year){
		if (Person.Alive(Year)==true){
			var InfectionStatus=Person.HCV.Infected.Value(Year);
			if (InfectionStatus==1){
				var DiagnosisStatus=Person.HCV.Diagnosed.Value(Year);
				if (DiagnosisStatus==1){
					return 1;
				}//else
				return 0;
			}
			else if (Person.HCV.AntibodyYear<=Year){// not currently infected, but was previously infected
				var DiagnosisStatus=Person.HCV.Diagnosed.Value(Year);
				if (DiagnosisStatus==1){
					return 3;
				}//else
				return 2;
			}
		}
		return NaN;
	};
	
	// Run the statistic
	var DiagnosisResult=new CountStatistic(StatSettings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	DiagnosisResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}


function AgeInfected(PPLocal, Time){
//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Age of people currently infected";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Age";
	StatSettings.Time=Time;

	//Define the selection/statistic function
	var AgeFunction= function (Person, Year){
		if (Person.Alive(Year)==true){
			if (Person.HCV.Infected.Value(Year)==1){
				return Person.Age(Year);
			}
		}
		return NaN;// not included in this statistic
	};
	
	// Run the statistic
	var AgeInfectedResult=new SummaryStatistic(StatSettings, AgeFunction);
	AgeInfectedResult.Run(PPLocal);

	return AgeInfectedResult;

}

function LivingWithHCVInfectionStats(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of people living with HCV";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.Time=Time;
	

	
	//Define the selection function
	var DiagnosisFunction= function (Person, Time){
		if (Person.Alive(Time)==true){
			var InfectionStatus=Person.HCV.Infected.Value(Time);
			if (InfectionStatus==1){
				return 1;
			}
		}
		return 0;
	};
	
	// Run the statistic
	var DiagnosisResult=new CountStatistic(StatSettings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	console.log(Settings.SampleFactor);

	DiagnosisResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}

function CurrentIDUStats(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of people who inject drugs";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.Time=Time;
	

	
	//Define the selection function
	var CurrentInjectorFunction= function (Person, Time){
		if (Person.IDU.CurrentlyInjecting(Time)){
			return 1;
		}
		return 0;
	};
	
	// Run the statistic
	var InjectingResult=new CountStatistic(StatSettings, CurrentInjectorFunction);
	InjectingResult.Run(PPLocal);

	InjectingResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return InjectingResult;
}

function EverIDUStats(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of people ever injecting drugs";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.Time=Time;
	

	
	//Define the selection function
	var CurrentInjectorFunction= function (Person, Time){
		if (Person.IDU.EverInjectedAtTime(Time)){
			return 1;
		}
		return 0;
	};
	
	// Run the statistic
	var InjectingResult=new CountStatistic(StatSettings, CurrentInjectorFunction);
	InjectingResult.Run(PPLocal);

	InjectingResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return InjectingResult;
}


function EverIDUHCVAntibodyStats(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of people ever injecting drugs who have HCV antibodies";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.Time=Time; // Time can either be an array, OR can have Time.StartTime, Time.EndTime, Time.StepSize

	
	//Define the selection function
	var StatsFunction= function (Person, Time){
		if (Person.IDU.EverInjectedAtTime(Time)){
			if (Person.HCV.AntibodyPresent(Time)){
				return 1;
			}
		}
		return 0;
	};
	
	// Run the statistic
	var EverIDUHCVResult=new CountStatistic(StatSettings, StatsFunction);
	EverIDUHCVResult.Run(PPLocal);

	EverIDUHCVResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	return EverIDUHCVResult;
}





function PWIDAgeStats(PPLocal, Time){
	//Create StatSettings
	var StatSettings={};
	StatSettings.Name="Number of People by Fibrosis Level";
	StatSettings.CountType="Instantaneous";
	StatSettings.XLabel="Year";
	StatSettings.YLabel="Count";
	StatSettings.MultipleCategories=true;
	StatSettings.NumberOfCategories=8;	
	
	StatSettings.Time=Time;
	
	// Define the  category description
	StatSettings.CategoryLabel=[];
	StatSettings.CategoryLabel[0]="0-15";
	StatSettings.CategoryLabel[1]="15-18";
	StatSettings.CategoryLabel[2]="18-25";
	StatSettings.CategoryLabel[3]="25-35";
	StatSettings.CategoryLabel[4]="35-45";
	StatSettings.CategoryLabel[5]="45-55";
	StatSettings.CategoryLabel[6]="55-65";
	StatSettings.CategoryLabel[7]="65+";
	
	
	//Define the selection function
	var StatsFunction= function (Person, Time){
		if (Person.IDU.CurrentlyInjecting(Time)){
			var Age=Person.Age(Time);
			if (Age<15){
				return 0;
			}
			else if (Age<18){
				return 1;
			}
			else if (Age<25){
				return 2;
			}
			else if (Age<35){
				return 3;
			}
			else if (Age<45){
				return 4;
			}
			else if (Age<55){
				return 5;
			}
			else if (Age<65){
				return 6;
			}
			return 7;
		}
		return NaN;
	};
	
	// Run the statistic
	var StatResult=new CountStatistic(StatSettings, StatsFunction);
	StatResult.Run(PPLocal);

	StatResult.Adjust(Settings.SampleFactor);// Make this representative sample actually reflect the real number of PWID
	
	return StatResult;
}
