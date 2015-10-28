// Optimisation information
// Data - type== count
// Data time (which is used for optimisation)
// Plotting time 
// Coupling with original data
// Simulated 
// Call one PWIDData, the other PWIDModel

// Extraction stage

// INside the model, it tells it how to run. 
// Outside the model, it tells it where to find the results. 


function DataExtractionObject(){
	this.Name="";
	this.GraphInterfaceID="";
	this.StatisticType="";
	this.ResultFunction;// ResultFunction(SimResult, Time), returns a single value.
	this.XLabel="";
	this.YLabel="";
	this.Title="";
	
	this.Data={};// specified follwing setup (must be a statistic type (count, summary, ratio))
	
	this.Data.Time=[];// uses the time specified in the data 
	this.Data.Value=[];// uses the time specified in the data 
	
	this.Graph={};
	this.Graph.Data={};
	this.Graph.Data.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Data.Value;
	this.Graph.Result={};
	this.Graph.Result.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Result.Value;
	
	this.Optimise=false;// is a flag used to determine if the object will be optimised or not
	this.Optimisation={};
	this.Optimisation.Weight=1;// Set to 1 by standard, but can be set higher or lower to more heavily weight certain parameters higher or lower
	this.Optimisation.ProportionalError=false;// Sets error to a function that is proportional to the data given
	
	this.Simulation={};
	this.Simulation.Value;
	this.Simulation.Time;
	
	this.ErrorWeight=[];// A weight that can be set in the ResultFunction to be used in ErrorFunction
	
	this.Error;// A place to store error, is a number (not an array)
	
	//this.ErrorFunction;// specifies how the error is determined. 
	// A custom error function can be set using DEOName.ErrorFunction=function() 
	
	// The following sections are used to summarise multiple simulations
	
	this.MultiSimResult=[];
	this.MultiSimData=[];
	
	this.MultiSimResultGraph;
	this.MultiSimDataGraph;
	
	
	this.GraphObject;
	this.DownloadData;
}

DataExtractionObject.prototype.SetData=function(Data){// SimulationResult.Population
	// The strange way this is structured is to allow the structure to throw an error if there is a problem
	// This should probably do a proper deep copy, but we aren't going to do this at this stage
	this.Data=Data;	
	this.Data.Value=Data.Value;
	this.Data.Time=Data.Time;
};

DataExtractionObject.prototype.SetGraphTime=function(TimeArray){// SimulationResult.Population
	this.Graph.Result.Time=TimeArray;
};


DataExtractionObject.prototype.FindError=function(SimulationResult){// SimulationResult.Population
	this.Simulation.Value=[];
	this.Simulation.Time=this.Data.Time;
	this.ErrorWeight=[];
	
	for (var TimeCount in this.Data.Time){
		this.Simulation.Value[TimeCount]=this.ResultFunction(SimulationResult,  this.Data.Time[TimeCount]);
	}
	
	this.Error=this.Optimisation.Weight*this.ErrorFunction(this.Data.Time, this.Data.Value, this.Simulation.Value, SimulationResult);
	
	return this.Error;
};

DataExtractionObject.prototype.AddErrorWeight=function(ErrorWeight){
	this.ErrorWeight.push(ErrorWeight);
};

DataExtractionObject.prototype.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){// SimulationResult
	// Note that this can be alterred by setting obj.Errorfunction=SomeFunction(TimeArray, DataArray, SimulationValueArray, SimulationResult);
	// Ordinarily you would operate on DataArray and  SimulationValueArray
	// However there may be a specific (and complicated) error function you want to perform given the full model results 
	// in this case you would operate on SimulationResult
	
	var Error;
	var DiffVec=Abs(Minus(DataArray, SimulationValueArray));
	if (this.Optimisation.ProportionalError){
		var PropDiffVec=Divide(DiffVec, Max(DataArray));
		Error=Sum(PropDiffVec);
	}
	else {
		Error=Sum(DiffVec);
	}
	return Error;
};


DataExtractionObject.prototype.GenerateGraphData=function(SimulationResult){
	this.Graph.Data.Time=this.Data.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Data.Value=this.Data.Value;
	
	this.Graph.Result.Value=[];
	
	for (var TimeCount in this.Graph.Result.Time){
		this.Graph.Result.Value[TimeCount]=this.ResultFunction(SimulationResult, this.Graph.Result.Time[TimeCount]);
	}
};

DataExtractionObject.prototype.SummariseMultipleSimulations=function(ArrayOfResults){
	// ArrayOfResult[Sim].Data, ArrayOfResult[Sim].Result
	
	
	var FirstResult=ArrayOfResults[0];
	if (typeof(FirstResult.Name)!="undefined"){
		this.Name=FirstResult.Name;
	}
	if (typeof(FirstResult.StatisticType)!="undefined"){
		this.StatisticType=FirstResult.StatisticType;
	}
	if (typeof(FirstResult.Title)!="undefined"){
		this.Title=FirstResult.Title;
	}
	if (typeof(FirstResult.XLabel)!="undefined"){
		this.XLabel=FirstResult.XLabel;
	}
	if (typeof(FirstResult.YLabel)!="undefined"){
		this.YLabel=FirstResult.YLabel;
	}
	
	
	// ArrayOfResults[Sim].Graph.Data.Time[Time];
	// ArrayOfResults[Sim].Graph.Data.Value[Time];
	// ArrayOfResults[Sim].Graph.Result.Time[Time];
	// ArrayOfResults[Sim].Graph.Result.Value[Time];
	
	
	// Take ArrayOfResults, sort into data/sim results
	for (var SimCount in ArrayOfResults){
		this.MultiSimData[SimCount]=ArrayOfResults[SimCount].Graph.Data;
		this.MultiSimResult[SimCount]=ArrayOfResults[SimCount].Graph.Result;
	}
	// this.MultiSimData[Sim].Time[Time]
	// this.MultiSimData[Sim].Value[Time]
	// this.MultiSimResult[Sim].Time[Time]
	// this.MultiSimResult[Sim].Value[Time]
	
	// MultiSimData.X[Time];
	// MultiSimData.Y[Time][Sim];
	
	function PerformSummaryStats(Input){

		
		var NumSims=Input.length;
		var NumTimes=Input[0].Time.length;
		
		var SummaryStat={};
		SummaryStat.Time=Input[0].Time;
		SummaryStat.Value=[];
		SummaryStat.Median=[];
		SummaryStat.Upper95Percentile=[];
		SummaryStat.Lower95Percentile=[];
		
		for (var TimeCount=0; TimeCount<NumTimes; TimeCount++){
			SummaryStat.Value[TimeCount]=[];
			for (var SimCount=0; SimCount<NumSims; SimCount++){
				SummaryStat.Value[TimeCount][SimCount]=Input[SimCount].Value[TimeCount];
			}
			SummaryStat.Median[TimeCount]=Median(SummaryStat.Value[TimeCount]);
			SummaryStat.Upper95Percentile[TimeCount]=Percentile(SummaryStat.Value[TimeCount], 97.5);
			SummaryStat.Lower95Percentile[TimeCount]=Percentile(SummaryStat.Value[TimeCount], 2.5);
		}

		return SummaryStat;
	}
	
	this.MultiSimDataSummary=PerformSummaryStats(this.MultiSimData);
	this.MultiSimResultSummary=PerformSummaryStats(this.MultiSimResult);
		
};

DataExtractionObject.prototype.DrawGraph=function(ThisObjectsGlobalID, GraphInterfaceID){

	
	// function to extract	data into the correct form
	var StructureForGraph95CI=function(InputStat){
		var ReturnObject={};
		ReturnObject.Y=InputStat.Median;
		ReturnObject.X=InputStat.Time;
		ReturnObject.Lower=InputStat.Lower95Percentile;
		ReturnObject.Upper=InputStat.Upper95Percentile;
		return ReturnObject;
	};
	

	var PlotSettings={};
	//PlotSettings.Name=this.Name;
	PlotSettings.Title=this.Title;
	PlotSettings.XLabel=this.XLabel;
	PlotSettings.YLabel=this.YLabel;
	PlotSettings.ObjectID=ThisObjectsGlobalID+".GraphObject";
	PlotSettings.InterfaceID=GraphInterfaceID;
	
	
	PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
		return OptimisationPlot(PlotPlaceholder, PlotData.Data, PlotData.Result);
	};

	PlotSettings.PlotData={};
	//	 PlotSettings.PlotData.Plot=[]; can this be deleted?
	PlotSettings.PlotData.Data=StructureForGraph95CI(this.MultiSimDataSummary);
	PlotSettings.PlotData.Result=StructureForGraph95CI(this.MultiSimResultSummary);

	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){
		console.log('This runs when the button is pushed');
	};

	this.GraphObject=new GeneralPlot(PlotSettings);// this must be global
	this.GraphObject.Draw();
};




function DataExtractionObjectGroup(Name){
	this.DEOArray=[];
	this.Name=Name;
	this.GraphInterfaceID="";
}

DataExtractionObjectGroup.prototype.AddDEO=function(DEOToAdd){
	// this function can either add a single DEO or an array of DEO
	// It takes a DEO or an array of DEOs as an argument
	
	if (DEOToAdd instanceof Array){
		this.DEOArray=this.DEOArray.concat(DEOToAdd);
	}
	else if (DEOToAdd instanceof DataExtractionObject){
		this.DEOArray.push(DEOToAdd);
	}
	else{
		throw "Input to .AddDEO should either be a DataExtractionObject or an Array of DataExtractionObject";	
	}
};

DataExtractionObjectGroup.prototype.TotalError=function(SimulationResult){
	var ErrorSum=0;
	for (var DEOCount in this.DEOArray){
		var ThisError=this.DEOArray[DEOCount].FindError(SimulationResult);
		if (isNaN(ThisError)){
			console.log(this.DEOArray[DEOCount].Name + " DEO produces NaNs");
		}
		else{
			ErrorSum+=ThisError;
		}
	}
	return ErrorSum;
};

DataExtractionObjectGroup.prototype.ErrorArray=function(){
	// Calling this gives and array of all the errors present in the group
	// This function should be called after the TotalError function is called
	var ErrorArray=[];
	for (var DEOCount in this.DEOArray){
		ErrorArray.push(this.DEOArray[DEOCount].Error);
	}
	return ErrorArray;
};




DataExtractionObjectGroup.prototype.GenerateGraphData=function(SimulationResult){
	for (var DEOCount in this.DEOArray){
	    this.DEOArray[DEOCount].GenerateGraphData(SimulationResult);
	}
	return this.DEOArray;
};

DataExtractionObjectGroup.prototype.Summarise=function(ResultsBySim){
	// ResultsBySim[Sim].DEOArray[SpecificStatCount]
	var DEOResultsBySim=[];
	for (var SimCount in ResultsBySim){
		DEOResultsBySim[SimCount]=ResultsBySim[SimCount].DEOResultsArray;
	}
	// DEOResultsBySim[SimCount][SpecificStatCount]
	var DEOArrayByStat=Transpose(DEOResultsBySim);
	
	console.log(DEOArrayByStat);
	
	if (this.DEOArray.length==0){
		for (var SpecificStatCount in DEOArrayByStat){
			this.DEOArray[SpecificStatCount]= new DataExtractionObject();
			this.DEOArray[SpecificStatCount].SummariseMultipleSimulations(DEOArrayByStat[SpecificStatCount]);
		}
	}
	else{
		// Try to package the results back into the currently existing DEOArry
		for (var SpecificStatCount in DEOArrayByStat){
			// determine if the names align - note that this is not a thorough test, merely an indicator. There may be other ways in which errors may arise due to misordering. 
			if (DEOArrayByStat[SpecificStatCount][0].Name != this.DEOArray[SpecificStatCount].Name){
				console.log("DEOArrayByStat");			
				console.log(DEOArrayByStat);
				console.log("this.DEOArray");		
				console.log(this.DEOArray);
				console.error("DEOArrayByStat[SpecificStatCount][0].Name: "+DEOArrayByStat[SpecificStatCount][0].Name);
				console.error("this.DEOArray[0].Name: "+this.DEOArray[0].Name);
				
				throw "The arrays appear to not be aligned in terms of their names. Please make sure that the same DEOArray is being used in the interface summary algorithms as in the model.";
			}

			
			
			this.DEOArray[SpecificStatCount].SummariseMultipleSimulations(DEOArrayByStat[SpecificStatCount]);
		}
	}
	
};


DataExtractionObjectGroup.prototype.GraphAll=function(GraphInterfaceID){
	// Draw the graph, but wait until the above has processed
	throw "This is not supposed to be used, as the references don't get transferred properly.";
	var SpecificStatCount=0;
	for (var SpecificStatRef in this.DEOArray){
		console.log(GraphInterfaceID+SpecificStatCount);
		
		this.DEOArray[SpecificStatRef].DrawGraph(GraphInterfaceID+SpecificStatCount);
		SpecificStatCount++;
	}
};

DataExtractionObjectGroup.prototype.CreatePlotHolders=function(GraphInterfaceID){
	
};






function FindAllDEOError(DEOArray, SimulationResult){
	var ErrorSum=0;
	for (var DEOCount in DEOArray){
	    ErrorSum+=DEOArray[DEOCount].FindError(SimulationResult);
		console.log(ErrorSum);
	}
	return ErrorSum;
}

function FindTotalDEOErrorForOptimisation(DEOArray, SimulationResult){
	var ErrorSum=0;
	for (var DEOCount in DEOArray){
		if (DEOArray[DEOCount].Optimise==true){
	    	ErrorSum+=DEOArray[DEOCount].FindError(SimulationResult);
		}
	}
	return ErrorSum;
}



	
function RunAllDEOGenerateGraphData(ODEOArray, SimulationResult){
	for (var ODEOCount in ODEOArray){
	    ODEOArray[ODEOCount].GenerateGraphData(SimulationResult);
	}
}
	

// // This function is run outside the simulation after all optimisations have occurred (i.e. this is summarising all results). 
// function SummariseAllDEO(ResultsBySim){
// 	// ResultsBySim[Sim].DEOArray[SpecificStatCount]
// 	var DEOResultsBySim=[];
// 	for (var SimCount in ResultsBySim){
// 		DEOResultsBySim[SimCount]=ResultsBySim[SimCount].DEOResultsArray;
// 	}
// 	// DEOResultsBySim[SimCount][SpecificStatCount]
// 	var DEOArrayByStat=Transpose(DEOResultsBySim);
	
// 	console.log(DEOArrayByStat);
// 	// Transpose to get at all the .DEOArray results
// 	//var ResultsByStat=TransposeArrObj(ResultsBySim);
// 	// ResultsByStat.DEOArray[Sim][SpecificStatCount]
// 	//var OptimisationArrayBySim=ResultsByStat.DEOArray;// Choose to operate only on the Optimisation results
// 	// OptimisationStatArray[Sim][SpecificStatCount]
// 	//var DEOArrayByStat=Transpose(OptimisationArrayBySim);// Stat count is an array
// 	//OptimisationStatArray[SpecificStatCount][Sim]
	
// 	var SummarisedDEOArray=[];
// 	for (var SpecificStatCount in DEOArrayByStat){
// 		SummarisedDEOArray[SpecificStatCount]= new DataExtractionObject();
// 		SummarisedDEOArray[SpecificStatCount].SummariseMultipleSimulations(DEOArrayByStat[SpecificStatCount]);
// 		// Draw the graph, but wait until the above has processed
// 		var GraphInterfaceID="OptimisationPlot"+SpecificStatCount;
// 		SummarisedDEOArray[SpecificStatCount].DrawGraph(GraphInterfaceID);
// 	}
	
// 	return SummarisedDEOArray;
// }
// // Set up the plots page
// // for (var i=0; i<100; i++){document.getElementById("OptimisatoinPlotsHolder").innerHTML+='<div class="plot" id="OptimisationPlot'+i+'" ></div>';}



