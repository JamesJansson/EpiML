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
	this.ModelFunction=Functions.ModelFunction;
	if (typeof(Functions.PreOptimisationFunction)=="string"){
		this.PreOptimisationFunction=Functions.PreOptimisationFunction;
	}
	if (typeof(Functions.PostOptimisationFunction)=="string"){
		this.PostOptimisationFunction=Functions.PostOptimisationFunction;
	}
	if (typeof(Functions.FunctionToRunOnCompletion)=="string"){
		this.FunctionToRunOnCompletion=eval(Functions.FunctionToRunOnCompletion);
	}
	
	this.DivPointer=document.getElementById(DivID);
	this.DEOID=DivID+"_DEO_";// 
	this.DEOErrorPlotID=DivID+"_DEOErrorPlot_";// 
	this.DEOResultsPlotID=DivID+"_DEOResultsPlot_";// 
	
	// Working on the external PointerToParamGroup
	this.ParamGroup=PointerToParamGroup;
	// This means that when paramgroup is updated, this.ParamGroupUpdated is called
	this.ParamGroup.AddUpdateFunction(this.ParamGroupUpdated);
	
	// Setting up the optimisation variables
	this.OptParamArray=[];
	this.ParamToOpt=[];// is used for selecting whether the optimisation occurs or not
	this.ArrayOfOptimisedResults=[];
	
	this.ImportParam();
	
	
	this.DEOArrayFunctionName=DEOArrayFunctionName;//
	this.DEOArrayFunction=eval(this.DEOArrayFunctionName);//
	this.DEOGroup=new DataExtractionObjectGroup(this.DEOArrayFunction);
	this.DEOGroup.AddDEO(this.DEOArrayFunction());

		
		
	// Use the DEO group to create a list of parameters to optimise to
	this.DEONameList=[];
	this.DEOToOpt=[];
	for (var DEOIndex in this.DEOGroup.DEOArray){
		this.DEONameList.push(this.DEOGroup.DEOArray[DEOIndex].Name);
		this.DEOToOpt.push(true);// this is ticked 
		//this.DEOToGraph.push(true);// this is ticked 
	}
	
	this.LiveUpdatePlots=true; // determines if the error Plots are updated at the end of each error round or not
	
	// Set up the threaded simulation that will run the optimisation
	
	
	// function to run on completion = this.CollateDEO
	
	// set the progress bar to the optimisation progress bar
	
	this.TerminateThreadOnSimCompletion=false;
	
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

OptSelector.prototype.SetUpSimulationHolder=function (){
	this.Settings.NoThreads
};




OptSelector.prototype.ImportParam=function (){
	//Clear the pointers to the optimsation array
	this.OptParamArray=[];
	this.ParamToOpt=[];
	// go through param group, find optimisedsamples
	for (var PCount in this.ParamGroup.ParamArray){
		if (this.ParamGroup.ParamArray[PCount].DistributionType=='optimisedsample'){
			var CurrentOptParam=this.ParamGroup.ParamArray[PCount];//Pointer
			this.OptParamArray.push(CurrentOptParam);//Pointer to the actual value
			this.ParamToOpt.push(false);
		}
	}
};



OptSelector.prototype.DrawParamDiv=function(){
	
	var HTMLString="";
	// draw the outer section
		// Draw a button to run the optimisation
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".RunOptimisation()'>Run optmisation</div>";
		// Toggle for the optimisation error and paramter value progress Plots 
		
		// Draw a tick box that determines if the optimisation displays results after each round or not
		var LiveUpdateString=this.Name+".LiveUpdatePlots";
		HTMLString+="    <input type='checkbox' onClick='"+LiveUpdateString+"=!'"+LiveUpdateString+";' value="+LiveUpdateString+"> Live update plots \n";
		
		
		// Draw a drop down that allows the user to select the simulation that is displayed in the progress??
		// Draw a box that is used to display the progress of error with time
		// This plot takes each of the sims's historical data and makes a multi line plot that displays all of the plots on a single plot
		// http://www.flotcharts.org/flot/examples/series-toggle/index.html
		
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".ShowAllParamProgressPlots()'>Show all param progress</div>";
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".HideAllParamProgressPlots()'>Hide all param progress</div>";
		
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".ShowAllResultsPlots()'>Show all results plots</div>";
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".HideAllResultsPlots()'>Hide all results plots</div>";
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".ShowAllErrorPlots()'>Show all error plots</div>";
		HTMLString+="<div class='SolidButton' style='float:left;' onClick='"+this.Name+".HideAllErrorPlots()'>Hide all error plots</div>";
		
	// for each optimisation parameter
	for (var PCount in this.OptParamArray){
		// Display the values as described in the ParamGroup
		HTMLString+="<div>\n";
		// Show the name of the variable
		HTMLString+="   <input type='text' 'value="+this.OptParamArray[PCount].ParameterID+";' readonly>\n";
		// Draw a box that displays that 
		var ParamOptString=this.Name+".ParamToOpt["+PCount+"];";
		HTMLString+="    <input type='checkbox' onClick='"+ParamOptString+"=!'"+ParamOptString+";' value="+ParamOptString+"> Optimise \n";
		
		// Draw a box that shows the progress of the error in this variable
		HTMLString+="    <div class='plot' id='"+this.ParamProgressPlotID+DEOCount+"' style='display:none;'>\n";
		
		// Display current results
			var Val=this.OptParamArray[PCount].Val;
			Mean(Val);// Mean
			SD(Val);// SD
			// 95% LCI 
			Percentile(Val, 2.5);
			// 95% UCI
			Percentile(Val, 97.5)
	}
	// for each optimisation data point 
	for (var DEOCount in this.DEONameList){
		HTMLString+="<div>\n";
		HTMLString+="   <input type='text' 'value="+this.DEONameList[DEOCount]+";' readonly>\n";
		var DEOOptString=this.Name+".DEOToOpt["+DEOCount+"];";
		// when the button is clicked, the falue flips
		HTMLString+="    <input type='checkbox' onClick='"+DEOOptString+"=!'"+DEOOptString+";' value="+DEOOptString+"> Optimise \n";
		
		//this.DEOErrorPlotID
		//this.DEOResultsPlotID
		// show hide Plots
		HTMLString+="    <div class='SolidButton' style='float:left;' onClick='ToggleDisplayByID("+this.DEOResultsPlotID+DEOCount+")'>Result Plot</div>\n";
		HTMLString+="    <div class='SolidButton' style='float:left;' onClick='ToggleDisplayByID("+this.DEOErrorPlotID+DEOCount+")'>Error Plot</div>\n";
		
		
		HTMLString+="    <div class='plot' id='"+this.DEOResultsPlotID+DEOCount+"' style='display:none;'>\n";
		HTMLString+="    <div class='plot' id='"+this.DEOErrorPlotID+DEOCount+"' style='display:none;'>\n";

		HTMLString+="</div>\n";
	}
	
	this.DivPointer.innerHTML=HTMLString;
};

OptSelector.prototype.ShowAllParamProgessPlots=function(){
	for (var ParamToOptCount in this.ParamToOpt){
		if (this.ParamToOpt[ParamToOptCount]){
			document.getElementById(this.ParamProgressPlotID+DEOCount).style.display='';
		}
	}
};

OptSelector.prototype.HideAllParamProgessPlots=function(){
	for (var ParamToOptCount in this.ParamToOpt){
		document.getElementById(this.ParamProgressPlotID+DEOCount).style.display='none';
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
		if(this.DEOToOpt[DEOCount]){// if it is being optimised
			document.getElementById(this.DEOErrorPlotID+DEOCount).style.display='';
		}
	}
};

OptSelector.prototype.HideAllResultsPlots=function(){
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
	
	this.SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateThreadOnSimCompletion); //Common is the same between all sims
	this.SimulationHolder.UseSimProgressBar=true;
	this.SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	//Creating the data to be used in the simulations
	if (this.Settings.RecalculateParam){
		ParamGroup.Recalculate(this.Settings.NumberOfSimulations);
	}
		
	RunSettings.SimDataArray=ParamGroup.ParameterSplit();
	
	RunSettings.FunctionName="OptSelectorHandler";
	RunSettings.Common=this.Common;
	RunSettings.TerminateThreadOnSimCompletion=this.TerminateThreadOnSimCompletion;
	RunSettings.FunctionToRunOnCompletion=this.PostOptimisationFunction;
	
	
	// Run the simulation
	this.SimulationHolder.Run(RunSettings);
	// wait for the result
	
	// collect up the data when finished
};

OptSelector.prototype.PostOptimisationFunction=function (){
	SummarisedOptimisationResults=this.ParamGroup.Summarise(this.SimulationHolder.Result);
	
	
	console.log("Infinite loop?")
	this.FunctionToFunctionToRunOnCompletion();
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

}

OptSelector.prototype.DrawErrorPlots=function (){
	this.ErrorPlotData=[];// this.ErrorPlotData[DataArrayNumber][SimNumber].XArrayValues/YArrayValues
	this.ParameterPlotData=[];
	
	// Do a recombination of all data
	//  for each of the data objects that are optimised to  in the 
	
	
	// 
	
	// for all sims  
		//
	// Update Plots
	
	
	
	
}


OptSelector.prototype.DrawDEOPlots=function (){
	this.DEOGroup.Summarise(this.SimulationHolder.Results);
	
	this.DEOGroup.GraphAll(this.DEOPlotID);
}



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
}

// This function is inside the model and is called 
// Note that 
function OptSelectorHandler(WorkerData){
	// There are typically three main functions that the optimisation is handed 
	// WorkerData.Common.PreOptimisationFunction
	// WorkerData.Common.ModelFunction
	// WorkerData.Common.PostOptimisationFunction
	
	var OptSelectorSettings=WorkerData.Common.OptSelectorSettings;
	
	
	// Set up the optimisation data extraction objects
	var DEOFunctionList=OptSelectorSettings.DEOFunctionList;
	
	for (var DEOFunctionCount in DEOFunctionList){
		var DEOOptGroup = new DataExtractionObjectGroup();	
		
	}
	
	
	
	
	
	// Create the general 
	
	
	
	
	var DEOArrayFunction=eval(OptSelectorSettings.DEOArrayFunction);
	var DEOArray = DEOArrayFunction();
	// Set up the parameters
	var OptimisationParam=WorkerData.Common.OptimisationParam;
	Param=WorkerData.SimData.Param;
	
	
	
	
	// Extract the ModelFunction to optimise
	if (typeof(WorkerData.Common.ModelFunction)=="undefined"){
		throw "ModelFunction was not set.";
	}
	else{
		var ModelFunction=eval(WorkerData.Common.ModelFunction);
	}
	
	
	// Extract and run the PreOptimisationFunction if it exists
	if (typeof(WorkerData.Common.PreOptimisationFunction)!="undefined"){
		var PreOptimisationFunction=eval(WorkerData.Common.PreOptimisationFunction);
		// Run the pre-code
		var InitialSetUpInput={};
		InitialSetUpInput.Param=Param;
		InitialSetUpInput.DEOArray=DEOArray;
		InitialSetUpInput.ModelFunction=ModelFunction;
		InitialSetUpInput.WorkerData=WorkerData;
		
		PreOptimisationFunction(InitialSetUpInput);
	}
	
	
	
	
	var OptimisationSettings={};
	OptimisationSettings.Target=DEOArray;
	
	
	OptimisationSettings.Function=function(FunctionInput, ParameterSet){
		// change Param according to the values listed in ParameterSet
		for (var Identifier in ParameterSet){
			eval("Param." + Identifier +"=ParameterSet["+Identifier+"];" );	
		}
		
		Param.Whatever=ParameterSet["Whatever"];
		Param.Whatever=ParameterSet["Whatever"];
		
		
		
		var FullModelResults=ModelFunction(FunctionInput.Notifications, FunctionInput.EndSimulationTime, FunctionInput.Intervention);
		
		
		return FullModelResults;
	};
	
	
	OptimisationSettings.ErrorFunction=function(Results, Target){// Done, unchecked
		var DEOArray=Target;
		var TotalOptimisationError=FindTotalDEOErrorForOptimisation(DEOArray, Results);
		
		return TotalOptimisationError;
	};
	
	
	OptimisationSettings.ProgressFunction=function(SimulationNumber, Parameter, SimOutput, ErrorValues){
		if (Common.DisplayProgress==true){
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
	
	
	
	
	var OptimisationObject=new StochasticOptimisation(OptimisationSettings);
	
	// Add the optimisation parameters
	// OptimisationObject.AddParameter("Param.HCV.ProbabilityOfTransmission", 0, 1);
	for (var iOP in OptimisationParameters){
		OptimisationObject.AddParameter(OptimisationParameters[iOP].Name, OptimisationParameters[iOP].Lower, OptimisationParameters[iOP].Upper);//Param.IDU.NSP.P	
	}
	
	OptimisationObject.Run(FunctionInput);
	
	
	if (typeof(WorkerData.Common.PostOptimisationFunction)!="undefined"){
		var PostOptimisationFunction=eval(WorkerData.Common.PostOptimisationFunction);
		// Run the pre-code
		ReturnedResults.PostOptimisation=PostOptimisationFunction(Param, DEOArray, WorkerData);
	}
	
	
	
	
	return ReturnedResults;
}


