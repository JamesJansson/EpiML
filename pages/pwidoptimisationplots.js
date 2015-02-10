// Initialise the variables associated with this page
var PWIDEntryPlotSettings={};
PWIDEntryPlotSettings.AgeRange=ZeroArray(4);
PWIDEntryPlotSettings.Sex=ZeroArray(2);

function PlotPWIDOptimisation(PWIDEntryPlotSettings){
	// There are multiple different graphs that can be produced from this:
	// Total by year
	// Individual levels for sex and age by year
	// Comparison of correctness of proportions - this is for the very far down the track

	// get the data
	// for each simulation
		// for each year
			// for each sex
				// for each age group
					// Add to the total for that year (both the result and the target)
					// Value[YearIndex].Sim.push
	
	// Do summary stats at the end (genralise)
		// mean
		// median etc
		
	
	
	PlotSettings=[];
	PlotSettings.Name="PWIDEntryPlotObject";// what the object will be called later
	PlotSettings.ID="PWIDEntryPlot";
	PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
		return OptimisationPlot(PlotPlaceholder, PlotData.OriginalData, PlotData.OptimisedResults);
	}
	PlotSettings.PlotData=[];
	PlotSettings.PlotData.Plot=[];

	var OriginalData={};
	OriginalData.X=[2, 4, 6];
	OriginalData.Y=[1.3, 2.3, 2.9];
	var OptimisedResults={};
	OptimisedResults.X=[2, 4, 6];
	OptimisedResults.Y=[1.5, 2.5, 3.5];
	OptimisedResults.Lower=[1.1, 2.1, 2.7];
	OptimisedResults.Upper=[1.9, 2.9, 3.9];

	PlotSettings.PlotData.OriginalData=OriginalData;
	PlotSettings.PlotData.OptimisedResults=OptimisedResults;

	PlotSettings.XLabel="Year";
	PlotSettings.YLabel="Number initiating injection drugs";

	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

	var PWIDEntryPlotObject=new GeneralPlot(PlotSettings);
	PWIDEntryPlotObject.Draw();
}