function StructureForUncertaintyPlot(Array){
		ReturnObject={};
		ReturnObject.Y=[];
		ReturnObject.Lower=[];
		ReturnObject.Upper=[];
		var NumTimes=Array.length;
		for(var TimeNum=0; TimeNum<NumTimes; TimeNum++){
			ReturnObject.Y[TimeNum]=Median(Array[TimeNum]);
			ReturnObject.Lower[TimeNum]=Percentile(Array[TimeNum], 2.5);;
			ReturnObject.Upper[TimeNum]=Percentile(Array[TimeNum], 97.5);;
		}
		return ReturnObject;
};

// a=ExtractDataFromSimulationByTime (SimulationHolder, "CurrentIDU")
function ExtractDataFromSimulationByTime (SimulationHolder, RefString){
	// Note this uses eval, which is not idea, but allows any value to be referenced
	// e.g. RefString="Intervention[1].CurrentPWID";
	
	// This function does not work for multiple categories
	
	var ResultsBySim=[];// ResultsBySim[SimNum][TimeNum]
	var RefObject;
	//var NumSims=SimulationHolder.Result.length;
	//for (var SimNum=0; SimNum<NumSims; SimNum++){
	for (var SimNum in SimulationHolder.Result){
		RefObject=eval(("SimulationHolder.Result[SimNum]."+RefString));
		ResultsBySim[SimNum]=RefObject.Count;
	}
	console.log(ResultsBySim);
	
	// Transpose
	// DataByTime=TransposeForCSV(DataBySim);
	var ResultsByTime=TransposeForCSV(ResultsBySim);
	
	var StructuredResults=StructureForUncertaintyPlot(ResultsByTime);
	// In this case, RefObject is the last in the array but it does not impact the results
	StructuredResults.X=RefObject.Time;//??
	StructuredResults.XLabel=RefObject.XLabel;
	StructuredResults.YLabel=RefObject.YLabel;
	
	return StructuredResults;
};





function PlotAGraph(){
	//var PlotSettings=ExtractDataFromSimulationByTime (SimulationHolder, "CurrentIDU");
	
	var SummarisedResult=PerformStatisticsByStat(SimulationHolder.Result);
	
	var StructureForGraph95CI=function(InputStat){
		var ReturnObject={};
		ReturnObject.Y=InputStat.Median;
		ReturnObject.X=InputStat.Time;
		ReturnObject.Lower=InputStat.Lower95Percentile;
		ReturnObject.Upper=InputStat.Upper95Percentile;
		return ReturnObject;
	};
	
	var SettingsForGraph=function(InputStat){
		var PlotSettings={};
		PlotSettings.Name=InputStat.Name;
		PlotSettings.XLabel=InputStat.XLabel;
		PlotSettings.YLabel=InputStat.YLabel;
		return PlotSettings;
	};
	
	
	
	var PlotData=StructureForGraph95CI(SummarisedResult.CurrentIDU);
	var PlotSettings=SettingsForGraph(SummarisedResult.CurrentIDU);
	//var PlotData=StructureForGraph95CI(SummarisedResult.EverIDU);
	//var PlotSettings=SettingsForGraph(SummarisedResult.EverIDU);
	//var PlotData=StructureForGraph95CI(SummarisedResult.LivingWithHCVInfection);
	//var PlotSettings=SettingsForGraph(SummarisedResult.LivingWithHCVInfection);

	PlotSettings.Name="PWIDEntryPlotObject";// what the object will be called later
	PlotSettings.ID="plot1";
	PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
		console.log(PlotData);
		return OptimisationPlot(PlotPlaceholder, PlotData.Data, PlotData.Results);
	};
	PlotSettings.PlotData=[];
	PlotSettings.PlotData.Plot=[];
	
	PlotSettings.PlotData.Data=PlotData;
	PlotSettings.PlotData.Results=PlotData;

	//PlotSettings.XLabel="Year";
	//PlotSettings.YLabel="Number ever injected drugs";

	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

	PWIDEntryPlotObject=new GeneralPlot(PlotSettings);// this must be global
	PWIDEntryPlotObject.Draw();
}



