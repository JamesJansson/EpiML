function DetermineFibrosis(PPLocal){
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
	Settings.NumberOfCategories=7;
	
	//Define the selection function
	FibrosisFunction= function (Person, Year){
		var InfectionStatus=Person.HCV.Infected.Value(Year);
		if (InfectionStatus==1){//currently infected
			return Person.HCV.Fibrosis.Value(Year); // in this case, the returned value is the numerical value found in the 
		}
		else if (Person.HCV.AntibodyYear<=Year){// not currently infected, but was previously infected
				//console.log("This year for this person: " +Person.HCV.AntibodyYear+ " " +Year);
			return 6;
		}
				//console.log("This year for this person: " +Person.HCV.AntibodyYear+ " " +Year);
		return NaN;
	};
	
	// Run the statistic
	FibrosisResult=new SummaryStatistic(Settings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	FibrosisResult.Function=0;//The function seems to need to be destroyed before passing the results back to the main controller of the webworker
	//FibrosisResult.Adjust(Param.SampleFactor);// Make this representative sample actually reflect the real number of diagnoses
	
	
	return FibrosisResult;
}