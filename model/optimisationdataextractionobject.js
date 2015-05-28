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
	this.Name;
	this.GraphInterfaceID;
	this.StatisticType;
	this.ResultFunction;// ResultFunction(Population, Time), returns a vector of times. Should be a population statistic
	this.XLabel;
	this.YLabel;
	
	this.Data;// specified follwing setup (must be a statistic type (count, summary, ratio))
	this.Result;
	this.DataTime;// uses the time specified in the data 
	this.GraphTime;// uses the range of times specified to show the full activity of the model
	
	this.ErrorFunction;// specifies how the error is determined. function() 
	
	this.MultiSimResult;
	this.MultiSimData;
	
	this.GraphObject;
	this.DownloadData;
}


// prototype CreateStatistic





OptimisationDataExtractionObject.prototype.ExtractDataAndFindError=function(SimulationResult){// SimulationResult.Population
	this.Result=this.ResultFunction(SimulationResult,  this.DataTime);
	var Error=this.ErrorFunction();
	
	return Error;
};

OptimisationDataExtractionObject.prototype.ErrorFunction=function(){// SimulationResult
	// Note that this can be alterred by setting obj.Errorfunction=SomeFunction;
	var ErrorVec=Minus(this.Data, this.Result);
	var Error=Sum(ErrorVec);
	return Error;
};


OptimisationDataExtractionObject.prototype.CreateGraphData=function(SimulationResult){
	
	this.Result=this.ResultFunction(SimulationResult,  this.GraphTime);
	
	var ThisCopy=DeepCopy(this);
	
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
	
	
	
	// Take ArrayOfResults, sort into data/sim results
	var SplitDataResult=TransposeArrObj(ArrayOfResults);
	// SplitDataResult.Data[Sim], SplitDataResult.Result[Sim], and other SplitDataResult.Things that are quite useless
	
	// Performs summary statistics on data
	this.MultiSimData=StatisticSelector(SplitDataResult.Data);
	// Performs summary statistics on the results
	this.MultiSimResult=StatisticSelector(SplitDataResult.Result);
	
	
};

OptimisationDataExtractionObject.prototype.Graph=function(){
	// Takes summarised results  this.MultiSimResult this.MultiSimData
	
	
	// function to extract	data into the correct form
	var StructureForGraph95CI=function(InputStat){
		ReturnObject={};
		ReturnObject.Y=InputStat.Median;
		ReturnObject.X=InputStat.Time;
		ReturnObject.Lower=InputStat.Lower95Percentile;
		ReturnObject.Upper=InputStat.Upper95Percentile;
		return ReturnObject;
	};
	
	console.error("Below is not a great way to set up the x and y labels");
	this.XLabel=this.MultiSimResult
	
	

	var PlotSettings={};
	PlotSettings.Name=this.Name;
	PlotSettings.XLabel=this.XLabel;
	PlotSettings.YLabel=this.YLabel;
	PlotSettings.ID=this.GraphInterfaceID;
	
	
	
	
	PlotSettings.PlotData={};
	//	 PlotSettings.PlotData.Plot=[]; can this be deleted?
	
	PlotSettings.PlotData.Data=StructureForGraph95CI(this.MultiSimData);
	PlotSettings.PlotData.Result=StructureForGraph95CI(this.MultiSimResult);


	PlotSettings.PlotFunction=function(PlotPlaceholder, PlotData){
		console.log(PlotData);
		return OptimisationPlot(PlotPlaceholder, PlotData.Data, PlotData.Result);
	};



	PlotSettings.Data=[];
	PlotSettings.Data.Download=function (){console.log('This runs when the button is pushed')};

	this.GraphObject=new GeneralPlot(PlotSettings);// this must be global
	this.GraphObject.Draw();
	
	
	
	
		
	// 
	
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
		StatSettings.Name="Number of people ever injecting drugs";
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
	
	

	for (var Sex=0; Sex<1; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[0];
			var UpperAge=Data.PWID.AgeRange[1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			var EverInjectorByAgeStatSettings=CreateEverInjectorByAgeStatSettings(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new OptimisationDataExtractionObject();
			
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

