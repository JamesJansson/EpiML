function CountFibrosisStages(PPLocal, SampleFactorMultiplier){
	//Create settings
	var Settings={};
	Settings.Name="Number of People by Fibrosis Level";
	Settings.Type="InstantaneousCount";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=1980;
	Settings.EndTime=2050;
	Settings.TimeStep=1;
	Settings.FunctionReturnsCategory=true;
	Settings.NumberOfCategories=8;
	
	//Define the selection function
	FibrosisFunction= function (Person, Year){
		if (Person.CurrentlyAlive(Year)==true){
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
	FibrosisResult=new SummaryStatistic(Settings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	
	FibrosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	FibrosisResult.CategoryLabel[0]="F0";//
	
	return FibrosisResult;
}



function LivingDxAndUDx(PPLocal, SampleFactorMultiplier){
	//Create settings
	var Settings={};
	Settings.Name="Number of people living with diagnosed ";
	Settings.Type="InstantaneousCount";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=1980;
	Settings.EndTime=2050;
	Settings.TimeStep=1;
	Settings.FunctionReturnsCategory=true;
	Settings.NumberOfCategories=8;
	
	//Define the selection function
	DiagnosisFunction= function (Person, Year){
		if (Person.CurrentlyAlive(Year)==true){
			var InfectionStatus=Person.HCV.Infected.Value(Year);
			if (InfectionStatus==1){
				var DiagnosisStatus=Person.HCV.Diagnosed.Value(Year);
				if (DiagnosisStatus==1){
					return 1;
				}//else
				return 0;
			}
		}
		return NaN;
	};
	
	// Run the statistic
	DiagnosisResult=new SummaryStatistic(Settings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	DiagnosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}




