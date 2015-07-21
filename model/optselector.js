// The purpose of this 

// Is given a pointer to a parameter group
// It provides the interface to the optimisation:
	// The optimised parameters of the model can be selected
	// Has an option to selected the function that will determine the data to optimise to 
	// Has an option which allows the parameter group to recalculated
		// Time stamp of the parameter group and when it was 
	// Displays the model being run (optimisation specific graphs)
// Creates a simulation, runs the optimisation, shuts down

// Stores the data back into the parameter group

// Saves the parameter group (with the optimisation inside)


// Functions={};
// Functions.ModelFunction="FullModel";
// Functions.PreOptimisationFunction="Prefunction"; optional
// Functions.PostOptimisationFunction="Postfunction"; optional
// Functions.FunctionToRunOnCompletion="FunctionToRunInterface"; optional
// DEOArrayFunctionName=HCVDataExtractionObjects;
// Common.Settings
// HCVOptSelector=new OptSelector('HCVOptSelector', 'HCVOptSelectorHolder', Functions, 'HCVDataExtractionObjects', Settings, Common);
function OptSelector(Name, DivID, Functions, PointerToParamGroup, DEOArrayFunctionName, Settings, ModelDirectory, Common){
	this.Name=Name;
	
	// Store the functions to be used in the simulation
	if (typeof(Functions.ModelFunction)!="string"){
		throw "Functions.ModelFunction must be set, otherwise there is nothing to optimise!";
	}
	
	this.Functions=Functions;
	
	// this.ModelFunction=Functions.ModelFunction;
	// if (typeof(Functions.PreOptimisationFunction)=="string"){
	// 	this.PreOptimisationFunction=Functions.PreOptimisationFunction;
	// }
	// if (typeof(Functions.PostOptimisationFunction)=="string"){
	// 	this.PostOptimisationFunction=Functions.PostOptimisationFunction;
	// }
	// if (typeof(Functions.FunctionToRunOnCompletion)=="string"){
	// 	this.FunctionToRunOnCompletion=eval(Functions.FunctionToRunOnCompletion);
	// }
	
	this.DivPointer=document.getElementById(DivID);
	this.DEOID=DivID+"_DEO_";// 
	this.DEOErrorPlotID=DivID+"_DEOErrorPlot_";// 
	this.DEOResultsPlotID=DivID+"_DEOResultsPlot_";// 
	this.ParamProgressPlotID=DivID+"_ParamProgressPlot_";// 
	// Working on the external PointerToParamGroup
	this.ParamGroup=PointerToParamGroup;
	// This means that when paramgroup is updated, this.ParamGroupUpdated is called
	this.ParamGroup.AddUpdateFunction(this.ParamGroupUpdated);
	
	// Setting up the optimisation variables
	this.OptParamArray=[];
	this.ParamToOptimise=[];// is used for selecting whether the optimisation occurs or not
	this.ArrayOfOptimisedSimOutput=[];
	
	this.ImportParam();
	
	
	this.DEOArrayFunctionName=DEOArrayFunctionName;//
	this.DEOArrayFunction=eval(this.DEOArrayFunctionName);//
	this.DEOGroup=new DataExtractionObjectGroup(this.DEOArrayFunctionName);
	this.DEOGroup.AddDEO(this.DEOArrayFunction());

		
		
	// Use the DEO group to create a list of parameters to optimise to
	this.DEONameList=[];
	this.DEOToOptimise=[];
	for (var DEOIndex in this.DEOGroup.DEOArray){
		this.DEONameList.push(this.DEOGroup.DEOArray[DEOIndex].Name);
		this.DEOToOptimise.push(true);// this is ticked 
		//this.DEOToGraph.push(true);// this is ticked 
	}
	
	this.LiveUpdatePlots=true; // determines if the error Plots are updated at the end of each error round or not
	
	// Set up the threaded simulation that will run the optimisation
	
	
	// function to run on completion = this.CollateDEO
	
	// set the progress bar to the optimisation progress bar
	
	this.TerminateThreadOnSimCompletion=false;
	
	
	this.ModelDirectory=ModelDirectory;
	
	
	this.Settings=Settings;// Note that setting is a pointer, and hence if Settings changes, then this.Settings changes too.
	this.Common=Common;
	
	this.SimulationHolder; //=new MultiThreadSim();

	//DataExtractionObjectArray

	
	
	
	
	
	this.ErrorHistory;
	this.ParameterHistory;	
	
	this.ErrorPlotData;// this.ErrorPlotData[DataArrayNumber][SimNumber].XArrayValues/YArrayValues
	this.ParameterPlotData;
	
	
	this.GraphColour=[];
	this.GenerateGraphColours(Settings.NoSims);
	

	
	// the information is sent to the worker, the worker finds the 


	
	
	this.DrawParamDiv();

}






OptSelector.prototype.ImportParam=function (){
	//Clear the pointers to the optimsation array
	this.OptParamArray=[];
	this.ParamToOptimise=[];
	// go through param group, find optimisedsamples
	for (var PCount in this.ParamGroup.ParamArray){
		if (this.ParamGroup.ParamArray[PCount].DistributionType=='optimisedsample'){
			var CurrentOptParam=this.ParamGroup.ParamArray[PCount];//Pointer
			this.OptParamArray.push(CurrentOptParam);//Pointer to the actual value
			this.ParamToOptimise.push(true);
		}
	}
};



OptSelector.prototype.DrawParamDiv=function(){
	
	var HTMLString="";
	// draw the outer section
		// Draw a button to run the optimisation
		HTMLString+="<div class='SolidButton'  onClick='"+this.Name+".ClickRun()'>Run optmisation</div>";
		// Toggle for the optimisation error and paramter value progress Plots 
		
		// Draw a tick box that determines if the optimisation displays results after each round or not
		var LiveUpdateString=this.Name+".LiveUpdatePlots";
		HTMLString+="    <input type='checkbox' onClick='"+LiveUpdateString+"=!"+LiveUpdateString+"';' value="+LiveUpdateString+"> Live update plots <br><br>\n";
		
		
		// Draw a drop down that allows the user to select the simulation that is displayed in the progress??
		// Draw a box that is used to display the progress of error with time
		// This plot takes each of the sims's historical data and makes a multi line plot that displays all of the plots on a single plot
		// http://www.flotcharts.org/flot/examples/series-toggle/index.html
		
		HTMLString+="<div style='width:100%;clear:both;height:100px;'>";
		HTMLString+="<div style='float:left;'> Param progress";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".ShowAllParamProgressPlots()'>Show</div>";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".HideAllParamProgressPlots()'>Hide</div>";
		HTMLString+="</div>";
		
		HTMLString+="<div style='float:left;'> Results plots";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".ShowAllResultsPlots()'>Show</div>";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".HideAllResultsPlots()'>Hide</div>";
		HTMLString+="</div>";
		
		HTMLString+="<div style='float:left;'> Error plots";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".ShowAllErrorPlots()'>Show</div>";
		HTMLString+="    <div class='SolidButton' onClick='"+this.Name+".HideAllErrorPlots()'>Hide</div>";
		HTMLString+="</div>";
		HTMLString+="</div>";
		HTMLString+="<h1>Parameters</h1>\n";
	// for each optimisation parameter
	for (var PCount in this.OptParamArray){
		// Display the values as described in the ParamGroup
		HTMLString+="<div style='width:100%;clear:both;'>\n";
		// Show the name of the variable
		HTMLString+="   <input type='text' value='"+this.OptParamArray[PCount].ParameterID+"' readonly ' style='width:300px;'>\n";
		// Draw a box that displays that 
		var ParamOptString=this.Name+".ParamToOptimise["+PCount+"]";
		if (this.ParamToOptimise[PCount]==true){
			HTMLString+="    <input type='checkbox' onClick='"+ParamOptString+"=!"+ParamOptString+";' checked> Optimise this \n";
		}
		else {
			HTMLString+="    <input type='checkbox' onClick='"+ParamOptString+"=!"+ParamOptString+";'> Optimise this \n";
		}
		
		// Draw a box that shows the progress of the error in this variable
		HTMLString+="<div style='width:100%;clear:both;'><div class='plot' id='"+this.ParamProgressPlotID+PCount+"' style='display:none;'></div></div>\n";
		HTMLString+="</div>\n";
		// Display current results
			// var Val=this.OptParamArray[PCount].Val;
			// Mean(Val);// Mean
			// SD(Val);// SD
			// // 95% LCI 
			// Percentile(Val, 2.5);
			// // 95% UCI
			// Percentile(Val, 97.5)
	}
	HTMLString+="<h1>Data objects</h1>\n";
	// for each optimisation data point 
	for (var DEOCount in this.DEONameList){
		HTMLString+="<div>\n";
		HTMLString+="    <div style='width:100%;clear:both;'>";
		HTMLString+="        <input type='text' value='"+this.DEONameList[DEOCount]+"' readonly ' style='width:300px;'>\n";
		var DEOOptString=this.Name+".DEOToOptimise["+DEOCount+"]";
		// when the button is clicked, the value flips
		if (this.DEOToOptimise[DEOCount]==true){
			HTMLString+="        <input type='checkbox' onClick='"+DEOOptString+"=!"+DEOOptString+";' checked> Optimise to this data\n";
		}
		else{
			HTMLString+="        <input type='checkbox' onClick='"+DEOOptString+"=!"+DEOOptString+";' > Optimise to this data\n";
		}
		
		HTMLString+="    </div>\n";
		HTMLString+="    <div style='width:100%;clear:both;'>\n";
		HTMLString+="        <div class='plot' id='"+this.DEOResultsPlotID+DEOCount+"' style='display:none;'></div>\n";
		HTMLString+="        <div class='plot' id='"+this.DEOErrorPlotID+DEOCount+"' style='display:none;'></div>\n";
		HTMLString+="    </div>\n";
		HTMLString+="</div>\n";
	}
	
	this.DivPointer.innerHTML=HTMLString;
};

OptSelector.prototype.ShowAllParamProgressPlots=function(){
	for (var ParamToOptimiseCount in this.ParamToOptimise){
		if (this.ParamToOptimise[ParamToOptimiseCount]){
			document.getElementById(this.ParamProgressPlotID+ParamToOptimiseCount).style.display='';
		}
	}
};

OptSelector.prototype.HideAllParamProgressPlots=function(){
	for (var ParamToOptimiseCount in this.ParamToOptimise){
		document.getElementById(this.ParamProgressPlotID+ParamToOptimiseCount).style.display='none';
	}
};



OptSelector.prototype.ShowAllResultsPlots=function(){
	for (var DEOCount in this.DEONameList){
		document.getElementById(this.DEOResultsPlotID+DEOCount).style.display='';
	}
};

OptSelector.prototype.HideAllResultsPlots=function(){
	for (var DEOCount in this.DEONameList){
		document.getElementById(this.DEOResultsPlotID+DEOCount).style.display='none';
	}
};

OptSelector.prototype.ShowAllErrorPlots=function(){
	for (var DEOCount in this.DEONameList){
		if(this.DEOToOptimise[DEOCount]){// if it is being optimised
			document.getElementById(this.DEOErrorPlotID+DEOCount).style.display='';
		}
	}
};

OptSelector.prototype.HideAllErrorPlots=function(){
	for (var DEOCount in this.DEONameList){
		document.getElementById(this.DEOErrorPlotID+DEOCount).style.display='none';
	}
};





// hide all results









OptSelector.prototype.ParamGroupUpdated=function(){
	this.ImportParam();
	this.DrawParamDiv();
};




OptSelector.prototype.ClickRun=function(){
	// select display progress page?
	this.RunOptimisation();
		
};



OptSelector.prototype.RunOptimisation=function (){
	// Send the optimisation settings to the simulation  
	this.Common.Settings=Settings;
	
	this.SimulationHolder=new MultiThreadSim(this.ModelDirectory, this.Settings.NumberOfSimulations , this.Settings.NoThreads); //Common is the same between all sims
	this.SimulationHolder.UseSimProgressBar=true;
	this.SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	//Creating the data to be used in the simulations
	if (this.Settings.RecalculateParam){
		this.ParamGroup.Recalculate(this.Settings.NumberOfSimulations);
	}
		
	RunSettings.SimDataArray=this.ParamGroup.ParameterSplit();
	
	RunSettings.FunctionName="OptSelectorHandler";
	RunSettings.Common=this.Common;

	///*****************
		///*****************
			///*****************
				///*****************
	var OptSelectorSettings={};
	OptSelectorSettings.ParamOptimisationArray=[];
	for (var OptCount in this.OptParamArray){
		if (this.ParamToOptimise[OptCount]){
			var CopyParamProperties={};
			CopyParamProperties.ParameterID=this.OptParamArray[OptCount].ParameterID;
			CopyParamProperties.MinValue=this.OptParamArray[OptCount].MinValue;
			CopyParamProperties.MaxValue=this.OptParamArray[OptCount].MaxValue;
			
			OptSelectorSettings.ParamOptimisationArray.push(CopyParamProperties);
		}
	}
	// all other Param should simply use the sample 

	
	OptSelectorSettings.DEOArrayFunctionName=this.DEOArrayFunctionName;
	OptSelectorSettings.DEOToOptimise=this.DEOToOptimise;
	
	OptSelectorSettings.Functions=this.Functions;

	
	RunSettings.Common.OptSelectorSettings=OptSelectorSettings;
	
	RunSettings.TerminateThreadOnSimCompletion=this.TerminateThreadOnSimCompletion;
	RunSettings.FunctionToRunOnCompletion=this.PostSimulationRunFunction();
	
	console.log(RunSettings);
	// Run the simulation
	this.SimulationHolder.Run(RunSettings);
	// wait for the result
	
	// collect up the data when finished
};

OptSelector.prototype.PostSimulationRunFunction=function (){
	var self=this; // this is designed to allow access to the OptSelector 'this' data through the variable 'self'
	
	var ReturnFunction=function(){
		
		console.log(self);
		
		
		console.log(self.DEOGroup);
		SummarisedOptimisationResults=self.DEOGroup.Summarise(self.SimulationHolder.Result);
		
		
		// console.log("Infinite loop?");
		// this.FunctionToFunctionToRunOnCompletion();
	}
	
	return  ReturnFunction;
};



OptSelector.prototype.PushToParamGroup=function (){
	// Takes array of optimised results
	// pushes to the paramgroup
	// Saves the results to file Param.Save 
};



OptSelector.prototype.UpdateError=function (DataFromSim){
	this.ErrorHistory[DataFromSim.SimNum]=DataFromSim.ErrorHistory;
	this.ParameterHistory[DataFromSim.SimNum]=DataFromSim.ParameterHistory;
	
	if (this.LiveUpdatePlots){
		this.DrawErrorPlots();
	}

};

OptSelector.prototype.DrawErrorPlots=function (){
	this.ErrorPlotData=[];// this.ErrorPlotData[DataArrayNumber][SimNumber].XArrayValues/YArrayValues
	this.ParameterPlotData=[];
	
	// Do a recombination of all data
	//  for each of the data objects that are optimised to  in the 
	
	
	// 
	
	// for all sims  
		//
	// Update Plots
	
	
	
	
};


OptSelector.prototype.DrawDEOPlots=function (){
	this.DEOGroup.Summarise(this.SimulationHolder.Results);
	
	this.DEOGroup.GraphAll(this.DEOPlotID);
};



OptSelector.prototype.GenerateGraphColours=function (NumberOfSimulations){
	function get_random_color() // http://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
	{
	    var color = "";
	    for(var i = 0; i < 3; i++) {
	    	var sub = Math.floor(Math.random() * 256).toString(16);
	    	color += (sub.length == 1 ? "0" + sub : sub);
	    }
	    return "#" + color;
	}
	
	this.GraphColour=[];
	for (var SimCount=0; SimCount<NumberOfSimulations; SimCount++){
		this.GraphColour.push(get_random_color());
	}
};








// This function is inside the model and is called 
// Note that 
function OptSelectorHandler(WorkerData){
	// There are typically three main functions that the optimisation is handed 
	// WorkerData.Common.Functions.PreOptimisationFunction
	// WorkerData.Common.Functions.ModelFunction
	// WorkerData.Common.Functions.PostOptimisationFunction
	
	var OptSelectorSettings=WorkerData.Common.OptSelectorSettings;
	
	
	
	// Extract the functions
	var Functions=OptSelectorSettings.Functions;
	if (typeof(Functions.ModelFunction)=="undefined"){
		throw "ModelFunction was not set.";
	}
	else{
		var ModelFunction=eval(Functions.ModelFunction);
	}
	if (typeof(Functions.PreOptimisationFunction)!="undefined"){
		var PreOptimisationFunction=eval(Functions.PreOptimisationFunction);
	}
	if (typeof(Functions.PostOptimisationFunction)!="undefined"){
		var PostOptimisationFunction=eval(Functions.PostOptimisationFunction);
	}
	
	console.error("Note the below is very bad form for a simulation. This should be PRIVATE.");
	Param=WorkerData.SimData.Param;
	
	var FunctionInput={};
	FunctionInput.Param=WorkerData.SimData.Param;
	FunctionInput.ModelFunction=ModelFunction;
	FunctionInput.PreOptimisationFunction=PreOptimisationFunction;
	FunctionInput.PostOptimisationFunction=PostOptimisationFunction;
	FunctionInput.Common=WorkerData.Common;
	FunctionInput.SimData=WorkerData.SimData;
	FunctionInput.WorkerData=WorkerData;
	
	
	
	var ReturnedResults={};
	
	// Extract and run the PreOptimisationFunction if it exists
	if (typeof(PreOptimisationFunction)=="function"){
		// Run the pre-code
		// This function may be used to do things like set up globals and format data in a way that should only be done once per instance 
		ReturnedResults.PreOptimisationResults=PreOptimisationFunction(FunctionInput);
	}
	
	
	
	// Set up the data extraction objects
	var DEOArrayFunction=eval(OptSelectorSettings.DEOArrayFunctionName);
	var DEOArray = DEOArrayFunction();
	var DEOToOptimise=OptSelectorSettings.DEOToOptimise;
	
	var DEOOptimisationArray=[];
	
	for (var DEOCount in DEOArray){
		if (DEOToOptimise[DEOCount]){// DEOToOptimise.indexOf(DEOArray[DEOCount].Name)>-1
			// if it is not on the list of DEO to optimise
			DEOOptimisationArray.push(DEOArray[DEOCount]);
		}
	}
	var DEOOptimisationGroup=new DataExtractionObjectGroup("DEOOptimisationGroup");
	DEOOptimisationGroup.AddDEO(DEOOptimisationArray);
	
	var DEOGroup=new DataExtractionObjectGroup("DEOGroup");
	DEOGroup.AddDEO(DEOArray);
	
	// Add the DEO to the function input for following cases
	
	// Set up the parameters
	var ParamOptimisationArray=OptSelectorSettings.ParamOptimisationArray;
	
	
	
	// Set up the optimisatoin
	var OptimisationSettings={};
	OptimisationSettings.Target=DEOOptimisationGroup;
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		
		
		// change Param according to the values listed in ParameterSet
		for (var Identifier in ParameterSet){
			// Param.Whatever.What=ParameterSet["Whatever.What"];
			var EvalString="Param." + Identifier +"=ParameterSet['"+Identifier+"'];";
			eval(EvalString);	
		}
		
		// Add .Notifcations, .EndSimulationTime, .Intervention, .Param  to FunctionInput
		var ModelResults=ModelFunction(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		return ModelResults;
	};
	
	OptimisationSettings.ErrorFunction=function(Results, Target){// Done, unchecked
		var DEOOptimisationGroup=Target;
		console.error("Fixing total error");
		console.log(DEOOptimisationGroup);
		var TotalOptimisationError=DEOOptimisationGroup.TotalError(Results);
		
		
		
		
		return TotalOptimisationError;
	};
	
	OptimisationSettings.SampleProgressFunction=function(OptimistationProgress, CurrentSimulationVals, AllSimulationVals, FunctionInput){
		var DEOOptimisationGroup=AllSimulationVals.Target;
		this.Store("DetailedError", DEOOptimisationGroup.ErrorArray());
		// Call a function that delivers Detailed error storage back to the interface
		
	}
	
	OptimisationSettings.RoundProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		console.error("Optimisation step "+SimulationNumber+" complete.");
		console.log(this.Storage.DetailedError);
		if (OptSelectorSettings.LiveUpdatePlots==true){
			// Send Parameter back to the main simulation
			// Send Error values backs to the main simulation 
			// Send ThreadNumber back 
			// SimulationNumber 
			// if it is from a particular sim, replace all existing 
			
			
			
			console.log("Params: X "+Mean(Parameter.X.CurrentVec)+" Y "+Mean(Parameter.Y.CurrentVec));
			var PSetCount=0;
			var Data=[];
			for (var key in Parameter.X.CurrentVec){
				Data[PSetCount]=[Parameter.X.CurrentVec[key], Parameter.Y.CurrentVec[key]];
				PSetCount++;
			}
			
			
			Data.Y=this.MeanError;
			Data.X=AscendingArray(0, this.MeanError.length-1);
			
			
			PlotSomething={};
			PlotSomething.Data=Data;
			PlotSomething.Code="ScatterPlot('#"+ Common.OptimisationPlotID+ "OptimisationPlotHolder0', Data,  'Step', 'Error Value');";
			self.postMessage({Execute: PlotSomething});
			
			// Parse back the historical error for the total and each data pulled
			
			
			
			
			// for each data found
			
			// for (key in this.Parameter){
			// 	CurrentParam=this.Parameter[key];
			// }
			
			
			//ScatterPlot('#PlotHolder', Data,  'AAA', 'BBB');
		}
	};
	
	// Set number of simulations
	OptimisationSettings.NumberOfSamplesPerRound=10;// note we'll randomly select one of these results
	OptimisationSettings.MaxIterations=10;// In this case, it will allow 10 000 different parameter selections, which gives a granularity of 1% of the range. Should be sufficient
	OptimisationSettings.MaxTime=20;//stop after 10 seconds
	
	
	
	var OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	
	// Add the optimisation parameters
	// OptimisationObject.AddParameter("Param.HCV.ProbabilityOfTransmission", 0, 1);
	
	console.error("This is where optimisation parameters are split");
	console.log(OptSelectorSettings);
	for (var iOP in OptSelectorSettings.ParamOptimisationArray){
		var POA=OptSelectorSettings.ParamOptimisationArray[iOP];
		OptimisationObject.AddParameter(POA.ParameterID, POA.MinValue, POA.MaxValue);//Param.IDU.NSP.P	
	}
	
	console.error("Created the OptimisationObject parameters for optimsation");
	console.log(OptimisationObject);
	
	// Run the function
	OptimisationObject.Run(FunctionInput);
	
	// Save the best optimised version of the parameter
	ReturnedResults.OptimisedParameter=OptimisationObject.ParameterFinal;
	
	ReturnedResults.ErrorProgress=OptimisationObject.ErrorValuesAllRounds;
	
	// This is where we run the model with the best parameterisation
	var SimulationResults=OptimisationObject.RunOptimisedSim(FunctionInput);
	// Get the error for this parameterisation
	ReturnedResults.OptimisedSimError=OptimisationObject.OptimisedSimError;
	// Create the data that is returned to the interface for graphing. 
	ReturnedResults.DEOGroupResultsArray=DEOGroup.GenerateGraphData(SimulationResults); 
	
	if (typeof(OptSelectorSettings.ExportOutput)!="undefined"){
		if (OptSelectorSettings.ExportOutput==true){
			ReturnedResults.OptimisedSimOutput=SimulationResults;
		}
	}
	
	if (typeof(PostOptimisationFunction)=="function"){
		ReturnedResults.PostOptimisationResults=PostOptimisationFunction(Param, DEOArray, WorkerData);
	}
	
	
	return ReturnedResults;
}