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


function OptimisationDataExtractionObject(){
	this.Name="";
	this.GraphInterfaceID="";
	this.StatisticType="";
	this.ResultFunction;// ResultFunction(SimResult, Time), returns a single value.
	this.XLabel="";
	this.YLabel="";
	this.Title="";
	
	this.Opt={};// specified follwing setup (must be a statistic type (count, summary, ratio))
	this.Opt.Data=[];// uses the time specified in the data 
	this.Opt.Time=[];// uses the time specified in the data 
	this.Opt.Result=[];// uses the time specified in the data 
	
	this.Graph={};
	this.Graph.Data={};
	this.Graph.Data.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Data.Value;
	this.Graph.Result={};
	this.Graph.Result.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Result.Value;
	
	
	//this.ErrorFunction;// specifies how the error is determined. function() 
	
	this.MultiSimResult=[];
	this.MultiSimData=[];
	
	this.MultiSimResultGraph;
	this.MultiSimDataGraph;
	
	
	this.GraphObject;
	this.DownloadData;
}

OptimisationDataExtractionObject.prototype.SetData=function(Data){// SimulationResult.Population
	this.Opt.Data=Data.Value;
	this.Opt.Time=Data.Time;
};

OptimisationDataExtractionObject.prototype.SetGraphTime=function(TimeArray){// SimulationResult.Population
	this.Graph.Result.Time=TimeArray;
};




OptimisationDataExtractionObject.prototype.RunDataAndFindError=function(SimulationResult){// SimulationResult.Population
	this.Opt.Result=[];
	for (var TimeCount in this.Opt.Time){
		this.Opt.Result[TimeCount]=this.ResultFunction(SimulationResult, this.Opt.Time[TimeCount]);
	}

	var Error=this.ErrorFunction();
	
	return Error;
};

OptimisationDataExtractionObject.prototype.ErrorFunction=function(){// SimulationResult
	// Note that this can be alterred by setting obj.Errorfunction=SomeFunction;

	var ErrorVec=Abs(Minus(this.Opt.Data, this.Opt.Result));
	var Error=Sum(ErrorVec);
	return Error;
};


OptimisationDataExtractionObject.prototype.GenerateGraphData=function(SimulationResult){
	this.Graph.Data.Time=this.Opt.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Data.Value=this.Opt.Data;
	
	this.Graph.Result.Value=[];
	
	for (var TimeCount in this.Graph.Result.Time){
		this.Graph.Result.Value[TimeCount]=this.ResultFunction(SimulationResult, this.Graph.Result.Time[TimeCount]);
	}
};

OptimisationDataExtractionObject.prototype.SummariseMultipleSimulations=function(ArrayOfResults){
	// ArrayOfResult[Sim].Data, ArrayOfResult[Sim].Result
	
	
	var FirstResult=ArrayOfResults[0];
	if (typeof(FirstResult.Name)!="undefined"){
		this.Name=FirstResult.Name;
	}
	if (typeof(FirstResult.GraphInterfaceID)!="undefined"){
		this.GraphInterfaceID=FirstResult.GraphInterfaceID;
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
		
		console.log(Input);
		
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
	
	console.log("SumStat on Data");
	this.MultiSimDataSummary=PerformSummaryStats(this.MultiSimData);
	console.log("SumStat on Result");
	this.MultiSimResultSummary=PerformSummaryStats(this.MultiSimResult);
		
};

OptimisationDataExtractionObject.prototype.DrawGraph=function(){

	
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
	PlotSettings.Name=this.Name;
	PlotSettings.Title=this.Title;
	PlotSettings.XLabel=this.XLabel;
	PlotSettings.YLabel=this.YLabel;
	PlotSettings.ID=this.GraphInterfaceID;
	
	
	PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
		return OptimisationPlot(PlotPlaceholder, PlotData.Data, PlotData.Result);
	};

	PlotSettings.PlotData={};
	//	 PlotSettings.PlotData.Plot=[]; can this be deleted?
	PlotSettings.PlotData.Data=StructureForGraph95CI(this.MultiSimDataSummary);
	PlotSettings.PlotData.Result=StructureForGraph95CI(this.MultiSimResultSummary);

	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

	this.GraphObject=new GeneralPlot(PlotSettings);// this must be global
	this.GraphObject.Draw();
	
	
	
};

function RunAllODEOError(ODEOArray, SimulationResult){
	var ErrorSum=0;
	for (var ODEOCount in ODEOArray){
	    ErrorSum+=ODEOArray[ODEOCount].RunDataAndFindError(SimulationResult);
	}
	return ErrorSum;
}
	
function RunAllODEOGenerateGraphData(ODEOArray, SimulationResult){
	for (var ODEOCount in ODEOArray){
	    ODEOArray[ODEOCount].GenerateGraphData(SimulationResult);
	}
}
	



// This function is run outside the simulation after all optimisations have occurred (i.e. this is summarising all results). 
function ExtractOptimisationObjects(ResultsBySim){
	// ResultsBySim[Sim].Optimisation[SpecificStatCount]
	var OptimisationResultsBySim=[];
	for (var SimCount in ResultsBySim){
		OptimisationResultsBySim[SimCount]=ResultsBySim[SimCount].Optimisation;
	}
	// OptimisationResultsBySim[SimCount][SpecificStatCount]
	var OptimisationArrayByStat=Transpose(OptimisationResultsBySim);
	
	console.log(OptimisationArrayByStat);
	// Transpose to get at all the .Optimisation results
	//var ResultsByStat=TransposeArrObj(ResultsBySim);
	// ResultsByStat.Optimisation[Sim][SpecificStatCount]
	//var OptimisationArrayBySim=ResultsByStat.Optimisation;// Choose to operate only on the Optimisation results
	// OptimisationStatArray[Sim][SpecificStatCount]
	//var OptimisationArrayByStat=Transpose(OptimisationArrayBySim);// Stat count is an array
	//OptimisationStatArray[SpecificStatCount][Sim]
	
	var Optimisation=[];
	for (var SpecificStatCount in OptimisationArrayByStat){
		Optimisation[SpecificStatCount]= new OptimisationDataExtractionObject();
		Optimisation[SpecificStatCount].SummariseMultipleSimulations(OptimisationArrayByStat[SpecificStatCount]);
		Optimisation[SpecificStatCount].DrawGraph();
	}
	
	return Optimisation;
}
// A=ExtractOptimisationObjects(SimulationHolder.Result);



// CREATE A SUB ELEMENT THAT DOES THE OPTIMSIATION
// Results.Optimisation.Stats // the arrays match
// Results.Optimisation.Data


// This function is run internally in each instance of the model
function SetupOptimisationDataExtractionObjects(){
	
	var GraphTime=AscendingArray(1970, 2020, 1);
	
	var DEO=[];//Array of OptimisationDataExtractionObject
	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
	// This section deals with the creation of summary statistics for ever injectors

	function CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Sex==Sex){
					if (Person.Alive(Time)){
						if (Person.IDU.EverInjectedAtTime(Time)){
							if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge){
								MatchCount++;
							}
						}
					}
				}
			}
			MatchCount=Multiply(MatchCount, Settings.SampleFactor);
			return MatchCount;
		};
		return FunctionHolder;
	}


	for (var Sex=0; Sex<2; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[AgeIndex][0];
			var UpperAge=Data.PWID.AgeRange[AgeIndex][1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new OptimisationDataExtractionObject();
			NewDEO.CountType="Instantaneous";
			// Name the Statistic and give labels
			var SexText;
			if (Sex==0){
				SexText="Male"; 
			}
			else {
				SexText="Female"; 
			}
			console.error("We need to work out a way of refrencing this.");
			
			var ObjectName="NumberOfPeopleEverInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
			NewDEO.Name=ObjectName;
			
			NewDEO.Title="Number of people ever injecting drugs ("+SexText+", "+LowerAge+"-"+UpperAge+")";
			
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Count";
			
			// Load the data into the function 
			var DataStruct={};
			DataStruct.Time=Data.PWID.Year;
			if (Sex==0){
				DataStruct.Value=Data.PWID.Ever.Male[AgeIndex];
			}
			else {
				DataStruct.Value=Data.PWID.Ever.Female[AgeIndex];
			}
			
			NewDEO.SetData(DataStruct);
			NewDEO.SetGraphTime(GraphTime);
			NewDEO.ResultFunction=EverInjectorByAgeFunction;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}
	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
// This section deals with the creation of summary statistics for ever injectors

	function CreateRecentInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Sex==Sex){
					if (Person.Alive(Time)){
						if (Person.IDU.EverInjectedAtTime(Time)){
							if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge){
								MatchCount++;
							}
						}
					}
				}
			}
			MatchCount=Multiply(MatchCount, Settings.SampleFactor);
			return MatchCount;
		};
		return FunctionHolder;
	}


	for (var Sex=0; Sex<2; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[AgeIndex][0];
			var UpperAge=Data.PWID.AgeRange[AgeIndex][1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new OptimisationDataExtractionObject();
			NewDEO.CountType="Instantaneous";
			// Name the Statistic and give labels
			var SexText;
			if (Sex==0){
				SexText="Male"; 
			}
			else {
				SexText="Female"; 
			}
			console.error("We need to work out a way of refrencing this.");
			
			var ObjectName="NumberOfPeopleEverInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
			NewDEO.Name=ObjectName;
			
			NewDEO.Title="Number of people ever injecting drugs ("+SexText+", "+LowerAge+"-"+UpperAge+")";
			
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Count";
			
			// Load the data into the function 
			var DataStruct={};
			DataStruct.Time=Data.PWID.Year;
			if (Sex==0){
				DataStruct.Value=Data.PWID.Ever.Male[AgeIndex];
			}
			else {
				DataStruct.Value=Data.PWID.Ever.Female[AgeIndex];
			}
			
			NewDEO.SetData(DataStruct);
			NewDEO.SetGraphTime(GraphTime);
			NewDEO.ResultFunction=EverInjectorByAgeFunction;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}

	
	
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of OptimisationDataExtractionObject
}

