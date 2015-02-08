function CountFibrosisStages(PPLocal, SampleFactorMultiplier, Time){
	//Create settings
	var Settings={};
	Settings.Name="Number of People by Fibrosis Level";
	Settings.CountType="Instantaneous";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=Time.Start;
	Settings.EndTime=Time.Stop;
	Settings.TimeStep=Time.Step;
	Settings.MultipleCategories=true;
	Settings.NumberOfCategories=8;
	
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
	
	
	// Define the  category description
	Settings.CategoryLabel=[];
	Settings.CategoryLabel[0]="F0";
	Settings.CategoryLabel[1]="F1";
	Settings.CategoryLabel[2]="F2";
	Settings.CategoryLabel[3]="F3";
	Settings.CategoryLabel[4]="F4";
	Settings.CategoryLabel[5]="Liver Failure";
	Settings.CategoryLabel[6]="HCC";
	Settings.CategoryLabel[7]="Antibody positive, cleared";
	
	// Run the statistic
	var FibrosisResult=new CountStatistic(Settings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	
	FibrosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	FibrosisResult.CategoryLabel[0]="F0";//
	
	return FibrosisResult;
}



function LivingDxAndUDx(PPLocal, SampleFactorMultiplier, Time){
	//Create settings
	var Settings={};
	Settings.Name="Number of people living with diagnosed and undiagnosed HCV";
	Settings.CountType="Instantaneous";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=Time.Start;
	Settings.EndTime=Time.Stop;
	Settings.TimeStep=Time.Step;
	Settings.MultipleCategories=true;
	Settings.NumberOfCategories=4;
	
	// Define the  category description
	Settings.CategoryLabel=[];
	Settings.CategoryLabel[0]="Undiagnosed & infected";
	Settings.CategoryLabel[1]="Diagnosed & infected";
	Settings.CategoryLabel[2]="Undiagnosed, uninfected & antibody+";
	Settings.CategoryLabel[3]="Diagnosed, uninfected & antibody+";
	
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
	var DiagnosisResult=new CountStatistic(Settings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	DiagnosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}


function AnalyseAgeInfected(PPLocal, Time){
//Create settings
	var Settings={};
	Settings.Name="Age of people currently infected";
	Settings.XLabel="Year";
	Settings.YLabel="Age";
	Settings.StartTime=Time.Start;
	Settings.EndTime=Time.Stop;
	Settings.TimeStep=Time.Step;

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
	var AgeInfectedResult=new SummaryStatistic(Settings, AgeFunction);
	AgeInfectedResult.Run(PPLocal);

	return AgeInfectedResult;

}

function CountLivingWithHCV(PPLocal, SampleFactorMultiplier, Time){
	//Create settings
	var Settings={};
	Settings.Name="Number of people living with HCV";
	Settings.CountType="Instantaneous";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=Time.Start;
	Settings.EndTime=Time.Stop;
	Settings.TimeStep=Time.Step;
	

	
	//Define the selection function
	var DiagnosisFunction= function (Person, Year){
		if (Person.Alive(Year)==true){
			var InfectionStatus=Person.HCV.Infected.Value(Year);
			if (InfectionStatus==1){
				return 1;
			}
		}
		return 0;
	};
	
	// Run the statistic
	var DiagnosisResult=new CountStatistic(Settings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	DiagnosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}
