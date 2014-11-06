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
	FibrosisResult=new SummaryStatistic(Settings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	
	FibrosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	FibrosisResult.CategoryLabel[0]="F0";//
	
	return FibrosisResult;
}



function LivingDxAndUDx(PPLocal, SampleFactorMultiplier){
	//Create settings
	var Settings={};
	Settings.Name="Number of people living with diagnosed and undiagnosed HCV";
	Settings.Type="InstantaneousCount";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=1980;
	Settings.EndTime=2030;
	Settings.TimeStep=1;
	Settings.FunctionReturnsCategory=true;
	Settings.NumberOfCategories=4;
	
	// Define the  category description
	Settings.CategoryLabel=[];
	Settings.CategoryLabel[0]="Undiagnosed & infected";
	Settings.CategoryLabel[1]="Diagnosed & infected";
	Settings.CategoryLabel[2]="Undiagnosed, uninfected & antibody+";
	Settings.CategoryLabel[3]="Diagnosed, uninfected & antibody+";
	
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
	DiagnosisResult=new SummaryStatistic(Settings, DiagnosisFunction);
	DiagnosisResult.Run(PPLocal);

	DiagnosisResult.Adjust(SampleFactorMultiplier);// Make this representative sample actually reflect the real number of diagnoses
	
	return DiagnosisResult;
}




