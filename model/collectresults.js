//This function is designed to be run at the end of a simulation to provide all of the desired summary stats of the population
// e.g. this will collect into a table the number of 
// The whole thing will be returned as a single structure to the interface that can then be plotted
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


function DetermineTotalHCCInfected(PPLocal){
	var StartYear=1980;
	var StopYear=2050;
	
	
	var FibrosisMatrix=new ZeroMatrix(6, StopYear-StartYear+1);

	CategoricalValueFunction=function (Person, Year){
		return Person.HCV.Fibrosis.Value(Year);// in this case, the returned value is the numerical value found in the 
	};

	

	var YearCount=0;
	for (var GraphYear=StartYear; GraphYear<StopYear; GraphYear++){
		for (var i=0; i<PPLocal.length; i++){
			FibrosisLevel=PPLocal[i].HCV.Fibrosis.Value(GraphYear);
			FibrosisMatrix[FibrosisLevel][YearCount]=FibrosisMatrix[FibrosisLevel][YearCount]+1;;
		}
		YearCount++;
		self.postMessage({ProgressBarValue: (YearCount/(YearsToSimulate+1))});
	}
	
	return FibrosisMatrix;
}





