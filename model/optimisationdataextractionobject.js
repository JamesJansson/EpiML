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
		this.Opt.Result[TimeCount]=this.ResultFunction(SimulationResult, this.Opt.Time[TimeCount])
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


OptimisationDataExtractionObject.prototype.CreateGraphData=function(SimulationResult){
	this.Graph.Data.Time=this.Opt.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Data.Value=this.Opt.Data;
	
	this.Graph.Result.Value=[];
	this.Graph.Result.Value=[];
	
	
	
	this.Opt.Result=[];
	for (var TimeCount in this.Opt.Time){
		this.Opt.Result[TimeCount]=this.ResultFunction(SimulationResult, this.Opt.Time[TimeCount])
	}
	
	return ThisCopy;// this is safe to return over the worker-worker divide
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
	if (typeof(FirstResult.XLabel)!="undefined"){
		this.XLabel=FirstResult.XLabel;
	}
	if (typeof(FirstResult.YLabel)!="undefined"){
		this.YLabel=FirstResult.YLabel;
	}
	
	
	ArrayOfResults[Sim].Graph.Data.Time;// uses the range of times specified to show the full activity of the model
	this.Graph.Result.Time;// uses the range of times specified to show the full activity of the model
	
	
	
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
		
		for (var TimeCount=0; TimeCount<NumTimes; TimeCount++){
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

OptimisationDataExtractionObject.prototype.Graph=function(){

	
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

// This function is run outside the loop after all optimisations have occurred. 
function ExtractOptimisationObjects(ResultsBySim){
	// ResultsBySim[Sim].Optimisation[SpecificStatCount]
	
	// Transpose to get at all the .Optimisation results
	var ResultsByStat=TransposeArrObj(ResultsBySim);
	// ResultsByStat.Optimisation[Sim][SpecificStatCount]
	var OptimisationArrayBySim=ResultsByStat.Optimisation;// Choose to operate only on the Optimisation results
	// OptimisationStatArray[Sim][SpecificStatCount]
	var OptimisationArrayByStat=Transpose(OptimisationArrayBySim);// Stat count is an array
	//OptimisationStatArray[SpecificStatCount][Sim]
	
	var Optimisation=[];
	for (var SpecificStatCount in OptimisationArrayByStat){
		Optimisation[SpecificStatCount]= new OptimisationDataExtractionObject();
		Optimisation[SpecificStatCount].SummariseMultipleSimulations(OptimisationArrayByStat[SpecificStatCount]);
	}
	
	return Optimisation;
}




// CREATE A SUB ELEMENT THAT DOES THE OPTIMSIATION
// Results.Optimisation.Stats // the arrays match
// Results.Optimisation.Data


// This function is run internally in each instance of the model
function SetupOptimisationDataExtractionObjects2(){
	
	var DEO=[];//Array of OptimisationDataExtractionObject
	

	// This section deals with the creation of summary statistics for ever injectors

	function CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Sex==Sex){
					if (Person.Alive(Time)){
						if (Person.IDU.EverInjectedAtTime(Time)){
							if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge)
							return 1;
						}
					}
				}
			}
			return 0;
		};
		return FunctionHolder;
	}


	for (var Sex=0; Sex<1; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[AgeIndex][0];
			var UpperAge=Data.PWID.AgeRange[AgeIndex][1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new OptimisationDataExtractionObject();
			

			NewDEO.CountType="Instantaneous";
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Count";
			NewDEO.Time=Time;
			
			var SexText;
			if (Sex==0){
				SexText="Male"; 
			}
			else {
				SexText="Female"; 
			}
			NewDEO.Name="Number of people ever injecting drugs("+SexText+", "+LowerAge+"-"+UpperAge+")";
				
			NewDEO.ResultFunction=EverInjectorByAgeFunction;

			DEO.push(NewDEO);
		}
	}
	

	
	
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of OptimisationDataExtractionObject
}


////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// This function is run internally in each instance of the model
function SetupOptimisationDataExtractionObjects(){
	
	var DEO=[];//Array of OptimisationDataExtractionObject
	
	new NewDEO=new OptimisationDataExtractionObject();
	NewDEO.Name="EverIDU";
	this.ResultFunction=new ;

	// This section deals with the creation of summary statistics for ever injectors

	function CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (Person, Time){
			if (Person.Sex==Sex){
				if (Person.Alive(Time)){
					if (Person.IDU.EverInjectedAtTime(Time)){
						if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge)
						return 1;
					}
				}
			}
			return 0;
		};
		return FunctionHolder;
	}
	function CreateEverInjectorByAgeStatSettings(Sex, LowerAge, UpperAge, Time){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var StatSettings={};

		StatSettings.CountType="Instantaneous";
		StatSettings.XLabel="Year";
		StatSettings.YLabel="Count";
		StatSettings.Time=Time;
		
		var SexText;
		if (Sex==0){
			SexText="Male"; 
		}
		else {
			SexText="Female"; 
		}
		StatSettings.Name="Number of people ever injecting drugs("+SexText+", "+LowerAge+"-"+UpperAge+")";
		
		return StatSettings;
	}
	

 	function CountStatisticErrorFunction(Data, Result){
		var ErrorVec=Abs(Minus(Data.Count, Result.Count));
		var Error=Sum(ErrorVec);
		return Error;
	}
	
	

	for (var Sex=0; Sex<1; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[0];
			var UpperAge=Data.PWID.AgeRange[1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			var EverInjectorByAgeStatSettings=CreateEverInjectorByAgeStatSettings(Sex, LowerAge, UpperAge, Time);
			
			
			var NewDEO=new OptimisationDataExtractionObject();
			
			NewDEO.Result=new CountStatistic(EverInjectorByAgeStatSettings, EverInjectorByAgeFunction);
			
			NewDEO.ErrorFunction=CountStatisticErrorFunction;
			
			
			
			
			NewDEO.Name;

			NewDEO.StatisticType;
			NewDEO.ResultFunction=ResultFunction(Population, Time), returns a vector of times. Should be a population statistic
			NewDEO.XLabel;
			NewDEO.YLabel;
			
			NewDEO.Data;// specified follwing setup (must be a statistic type (count, summary, ratio))
			NewDEO.Result;
			NewDEO.DataTime;// uses the time specified in the data 
			NewDEO.GraphTime;// uses the range of times specified to show the full activity of the model
			
			
			Data.PWID.Year
			
			DEO.push(NewDEO);
		}
	}
	
	

	
	
	
	// For age based ever injected
	//for both sexes{
	//	for all ages in the Data
	
	//}
	
	
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of OptimisationDataExtractionObject
}

