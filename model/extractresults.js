function DetermineFibrosis(PPLocal){
	//Create settings
	var Settings={};
	Settings.Name="Fibrosis Level";
	Settings.Type="InstantaneousCount";
	Settings.XLabel="Year";
	Settings.YLabel="Count";
	Settings.StartTime=1980;
	Settings.EndTime=2050;
	Settings.TimeStep=1;
	Settings.FunctionReturnsCategory=true;
	Settings.NumberOfCategories=6;
	
	//Define the selection function
	FibrosisFunction= function (Person, Year){
		return Person.HCV.Fibrosis.Value(Year); // in this case, the returned value is the numerical value found in the 
	};
	
	// Run the statistic
	FibrosisResult=new SummaryStatistic(Settings, FibrosisFunction);
	FibrosisResult.Run(PPLocal);

	
	FibrosisResult.Function=0;

	
	return FibrosisResult;
}