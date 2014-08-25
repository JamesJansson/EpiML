//This function is designed to be run at the end of a simulation to provide all of the desired summary stats of the population
// e.g. this will collect into a table the number of 
// The whole thing will be returned as a single structure to the interface that can then be plotted
function GenerateSummaryStats(){
	var SummaryResults={};

	SummaryResults.TotalHCC={};
	SummaryResults.TotalHCC.GraphType=;
	SummaryResults.TotalHCC.Table=[];// run the summary stats algos to find the appropriate population
	SummaryResults.TotalHCC.XLabel="Year";
	SummaryResults.TotalHCC.YLabel="Total HCC diagnoses";
	SummaryResults.TotalHCC.SeriesName="Total HCC diagnoses";


	return SummaryResults;
}