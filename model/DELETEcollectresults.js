//This function is designed to be run at the end of a simulation to provide all of the desired summary stats of the population
// e.g. this will collect into a table the number of 
// The whole thing will be returned as a single structure to the interface that can then be plotted

	console.log("Loading collectresults.js");
function GenerateSummaryStats(Population){
	var SummaryResults={};

	SummaryResults.TotalHCC={};
	SummaryResults.TotalHCC.GraphType='stackedbar';
	SummaryResults.TotalHCC.Table=[];// run the summary stats algos to find the appropriate population
	SummaryResults.TotalHCC.XLabel="Year";
	SummaryResults.TotalHCC.YLabel="Total HCC diagnoses";
	SummaryResults.TotalHCC.SeriesName="Total HCC diagnoses";

	SummaryResults.FibrosisLevels={};
	SummaryResults.FibrosisLevels.GraphType='stackedarea';
	SummaryResults.FibrosisLevels.Table=[];// run the summary stats algos to find the appropriate population
	SummaryResults.FibrosisLevels.XLabel="Year";
	SummaryResults.FibrosisLevels.YLabel="Total HCC diagnoses";
	SummaryResults.FibrosisLevels.SeriesName="Total HCC diagnoses";

	
	
	
	return SummaryResults;
}


function DetermineFibrosis(Population){
	//Create settings
	var Settings={};
	Settings.Name="Number of People by Fibrosis Level";
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
	FibrosisResult.Run(Population);

	return FibrosisResult;
}


	console.log("Loaded collectresults.js");

