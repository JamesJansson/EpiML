// Initialise the variables associated with this page
var PWIDEntryPlotSettings={};
PWIDEntryPlotSettings.AgeRange=ZeroArray(4);
PWIDEntryPlotSettings.Sex=ZeroArray(2);

/* 	ExtractDataFromFiles();
	MaleMortality=new MortalityCalculator(Param.MaleMortality.Rates1, Param.MaleMortality.Year1, Param.MaleMortality.Rates2, Param.MaleMortality.Year2);
	FemaleMortality=new MortalityCalculator(Param.FemaleMortality.Rates1, Param.FemaleMortality.Year1, Param.FemaleMortality.Rates2, Param.FemaleMortality.Year2);
	PWIDEntryOptimisationResults=OptimiseByGender(Data.PWID); */



function PlotPWIDEntryOptimisation(Sex){
	// There are multiple different graphs that can be produced from this:
	// Total by year
	// Individual levels for sex and age by year
	// Comparison of correctness of proportions - this is for the very far down the track

	// get the data
	// for each simulation
		// for each year
			// for each age group
				// for each sex
					//
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

	
	// add each
	var SumTheResults=function(Array){// given [6]*[4] array 
		ReturnObject=[];
		for (var i=0; i<6; i++){
			ReturnObject[i]=Sum(Array[i]);
		}
		return ReturnObject;
	};
	var DoStats=function(Array){
		ReturnObject={};
		ReturnObject.Y=[];
		ReturnObject.Lower=[];
		ReturnObject.Upper=[];
		var NumYears=Array.length;
		for(var YearNum=0; YearNum<NumYears; YearNum++){
			ReturnObject.Y[YearNum]=Median(Array[YearNum]);
			ReturnObject.Lower[YearNum]=Percentile(Array[YearNum], 2.5);;
			ReturnObject.Upper[YearNum]=Percentile(Array[YearNum], 97.5);;
		}
		return ReturnObject;
	};
	
	var NumSims=SimulationHolder.Result.length;
	var DataBySim=[];
	var ResultsBySim=[];
	for (var SimNum=0; SimNum<NumSims; SimNum++){
		DataBySim[SimNum]=SumTheResults(SimulationHolder.Result[SimNum].OriginalData[Sex].OriginalData.Data);
		ResultsBySim[SimNum]=SumTheResults(SimulationHolder.Result[SimNum].OriginalData[Sex].Results.Data);
	}
	
	// Transpose
	DataByYear=TransposeForCSV(DataBySim);
	ResultsByYear=TransposeForCSV(ResultsBySim);
	// Do stats on it
	OriginalData=DoStats(DataByYear);
	OptimisedResults=DoStats(ResultsByYear);

	// Add the year vector
	OriginalData.X=SimulationHolder.Result[0].OriginalData[0].OriginalData.Year;
	OptimisedResults.X=SimulationHolder.Result[0].OriginalData[0].OriginalData.Year;
	
	//Process results


	
	
	
	/*var OriginalData={};
	OriginalData.X=[2, 4, 6];
	OriginalData.Y=[1.3, 2.3, 2.9];
	OptimisedResults.Lower=[1.2, 2.1, 2.8];
	OptimisedResults.Upper=[1.4, 2.5, 3.0];
	var OptimisedResults={};
	OptimisedResults.X=[2, 4, 6];
	OptimisedResults.Y=[1.5, 2.5, 3.5];
	OptimisedResults.Lower=[1.1, 2.1, 2.7];
	OptimisedResults.Upper=[1.9, 2.9, 3.9];*/

	PlotSettings.PlotData.OriginalData=OriginalData;
	PlotSettings.PlotData.OptimisedResults=OptimisedResults;

	PlotSettings.XLabel="Year";
	PlotSettings.YLabel="Number ever injected drugs";

	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

	var PWIDEntryPlotObject=new GeneralPlot(PlotSettings);
	PWIDEntryPlotObject.Draw();
}