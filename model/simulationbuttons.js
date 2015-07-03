// This file contains the scripts that are called when the buttons on the interface are pressed.

function MultiFunctionRun(){
	// the purpose of this function is to run one function, and when it is done, run the next. This object determines which one should happen next
	// It is important to note that each function should only be executed once
	// FunctionRunner=new MultiFunctionRun;
	// FunctionRunner.FunctionArray[0]=Function0;
	// FunctionRunner.FunctionArray[1]=Function1;
	// Function0 should call FunctionRunner.RunNextFunction() once only when it is done. 
	// If it calls it twice, the function index will reach 2, but there is no FunctionArray[2] and this will cause an error
	
	this.StepRunning=-1;
	this.FunctionArray=[];
}

MultiFunctionRun.prototype.RunNextFunction= function (){
	this.StepRunning++;
	if (this.StepRunning<this.FunctionArray.length){
		this.FunctionArray[this.StepRunning]();
	}
	else {
		console.error("The function runner has run out of functions in the array to run")
	}
};

MultiFunctionRun.prototype.Reset= function (){
	this.StepRunning=-1;
};








var FunctionRunner;
function RunFullOptimisationAndDataExtration(){

	// Load the values from the files
	//ExtractDataFromFiles();
	
	// The following is required for all programs
	SimSettings.SampleFactor=Settings.SampleFactor;
	
	// Save into the Common holder
	var Common={};
	Common.Data=Data;
	Common.Param=[];//this where parameters that are the same between simulations are entered
	Common.Settings=SimSettings;
	
	//Creating the data to be used in the simulations
	// var Settings.RecalculateParam=true;
	if (Settings.RecalculateParam){
		PGroup.Recalculate(Settings.NumberOfSimulations);
	}
	var SimInputData=PGroup.ParameterSplit();
	//var SimInputData=ParameterSplit(PGroup.ParamArray, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
	//Creating the simulation holder
	var TerminateOnFinish=false;
	SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateOnFinish); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	
	FunctionRunner=new MultiFunctionRun();
	FunctionRunner.FunctionArray[0]=OptimiseParameters;
	FunctionRunner.FunctionArray[1]=RunSimulation1;
	
}


function OptimiseParameters(){
	
	
	
	RunSettings={};
	RunSettings.FunctionName="NotificationBackProjection";
	RunSettings.Common=Common;
	RunSettings.SimDataArray=SimInputData;
	RunSettings.TerminateOnFinish=false;
	RunSettings.FunctionToRunOnCompletion=function(){
		SimOutput=RearrangeSimResults(this.Result);//here 'this' refers to the .Result  stored in simulation holder
		AggregatedResults=AggregateSimResults(SimOutput);

		// NotificationSimPlot();
	}
	
	
	// Run the simulation
	SimulationHolder.Run(RunSettings);

	return 0;
}


function RunPersistentSim(){


	// Load the values from the files
	//ExtractDataFromFiles();
	
	//var SimSettings={};
	//SimSettings.RunOptimisation=true;
	//console.error("SimSettings.RunOptimisation hard set above");
	// The following is required for all programs
	//SimSettings.SampleFactor=Settings.SampleFactor;
	
	// Save into the Common holder
	var Common={};
	Common.Data=Data;
	Common.Param=[];//this where parameters that are the same between simulations are entered
	Common.Settings=Settings;
	
	//Creating the data to be used in the simulations
	Settings.RecalculateParam=true;
	console.error("Settings.RecalculateParam hard set here. ");
	
	if (Settings.RecalculateParam){
		PGroup.Recalculate(Settings.NumberOfSimulations);
	}
	var ParamArrayBySim=PGroup.ParameterSplit();
	//var ParamArrayBySim=ParameterSplit(PGroup.ParamArray, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
	//Creating the simulation holder
	var TerminateOnFinish=false;
	SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateOnFinish); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	RunSettings.FunctionName="NotificationBackProjection";
	RunSettings.Common=Common;
	RunSettings.SimDataArray=ParamArrayBySim;
	RunSettings.TerminateOnFinish=false;
	RunSettings.FunctionToRunOnCompletion=function(){
		console.error("Not sure if we want the below in global scope");
		SimOutput=RearrangeSimResults(this.Result);//here 'this' refers to the .Result  stored in simulation holder
		AggregatedResults=AggregateSimResults(SimOutput);

		NotificationSimPlot();
	}
	
	
	// Run the simulation
	SimulationHolder.Run(RunSettings);

	return 0;
}


function RunSimSetup(){
	// Load the values from the files
	
	//var SimSettings={};
	//SimSettings.RunOptimisation=true;
	//console.error("SimSettings.RunOptimisation hard set above");
	// The following is required for all programs
	//SimSettings.SampleFactor=Settings.SampleFactor;
	
	// Save into the Common holder
	var Common={};
	Common.Data=Data;
	Common.Param=[];//this where parameters that are the same between simulations are entered
	Common.Settings=Settings;
	
	//Creating the data to be used in the simulations
	if (Settings.RecalculateParam){
		PGroup.Recalculate(Settings.NumberOfSimulations);
	}
	var ParamArrayBySim=PGroup.ParameterSplit();
	//var ParamArrayBySim=ParameterSplit(PGroup.ParamArray, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
	//Creating the simulation holder
	var TerminateOnFinish=false;
	SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateOnFinish); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	RunSettings.FunctionName="SimSetup";
	RunSettings.Common=Common;
	RunSettings.SimDataArray=ParamArrayBySim;
	RunSettings.TerminateOnFinish=false;
	RunSettings.FunctionToRunOnCompletion=function(){
		// SimOutput=RearrangeSimResults(this.Result);//here 'this' refers to the .Result  stored in simulation holder
		// AggregatedResults=AggregateSimResults(SimOutput);

		// NotificationSimPlot();
	};
	
	
	// Run the simulation
	SimulationHolder.Run(RunSettings);

	return 0;
}

function RunFullModelTest(){
	// Set up the plots page
	document.getElementById("OptimisationPlotsHolder").innerHTML="";
	for (var i=0; i<100; i++){document.getElementById("OptimisationPlotsHolder").innerHTML+='<div class="plot" id="OptimisationPlot'+i+'" ></div>';}

	
	var RunSettings2={};
	
	RunSettings2.FunctionName="FullModelTest";
	RunSettings2.Common={};
	RunSettings2.Common.HCVTretmentFunctionID=Settings.HCVTreatmentScenario;
	
	RunSettings2.FunctionToRunOnCompletion=function(){
		// Display all results
		SummarisedOptimisationResults=SummariseAllDEO(SimulationHolder.Result);
	};
	
	
	SimulationHolder.Run(RunSettings2);
}


function RearrangeSimResults(ResultsArray){
	// Makes results that are in the format SimOutput[InterventionCount][SimCount]
	// Sort by interventions
	// Determine number of interventions
	
	var NumSims=ResultsArray.length;
	var NumInterventions=ResultsArray[0].Intervention.length;
	var NumStats=ResultsArray[0].Intervention[0].length;// the number of stats
	
	var SimOutput=[];
	for (var IntCount=0; IntCount< NumInterventions; IntCount++){
		SimOutput[IntCount]=[];
		for (var StatCount=0; StatCount<NumStats; StatCount++){
			SimOutput[IntCount][StatCount]=[];
			for (var SimCount=0; SimCount<NumSims; SimCount++){
				SimOutput[IntCount][StatCount][SimCount]=ResultsArray[SimCount].Intervention[IntCount][StatCount];
			}
		}
	}
	return SimOutput;
}

function AggregateSimResults(SimOutput){
	var NumInterventions=SimOutput.length;
	var NumStats=SimOutput[0].length;
	var NumSims=SimOutput[0][0].length;
	var AggregatedResults=[];
	var NumAggregatedResults=0;
	for (var IntCount=0; IntCount< NumInterventions; IntCount++){
		for (var StatCount=0; StatCount<NumStats; StatCount++){
			console.log(SimOutput[IntCount][StatCount]);
			console.log(SimOutput[IntCount][StatCount][0].StatisticType);
			console.log(SimOutput[IntCount][StatCount][0].MultipleCategories);
			if (typeof(SimOutput[IntCount][StatCount][0].StatisticType)!="undefined"){// if it has a statistic type
				if (SimOutput[IntCount][StatCount][0].StatisticType=="countstatistic" && SimOutput[IntCount][StatCount][0].MultipleCategories==false ){// if it is a countstatistic and it is not a multi stat
					AggregatedResults[NumAggregatedResults]=new MultiSimCountStat(SimOutput[IntCount][StatCount]);
					NumAggregatedResults++;
				}
			}
		}
	}
		// for each sim
			// for each statistic
				
	return AggregatedResults;
}




function NotificationSimPlot(){
	// Get the relevant data
	var IntCount=0;
	var SimCount=0;
	var StatCount=0;
	var IndividualStat=SimOutput[IntCount][StatCount][SimCount];
	FibrosisArray=IndividualStat.Count;
	TimeAxis=IndividualStat.Time;
	
	console.log(IndividualStat);
	console.log(FibrosisArray);
	console.log(TimeAxis);
	
	// convert to a form that plot will accept
	console.log("TimeAxis then FibrosisArray");
	console.log(TimeAxis);
	console.log(FibrosisArray);
	PlotData=PlotStyles_ConvertDataToLinePlot(TimeAxis, FibrosisArray);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	PlotSettings={xaxis: {
					axisLabel: 'Time (years)',
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					min: 0,
					axisLabel: 'Number of people',
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				},
				series: {
					lines: {
						show: true,
						fill: true
					},
					stack: true
				}
			};
	

	$.plot("#plot1_placeholder", PlotData, PlotSettings);

}









function DxUDxSimPlot(){
	// Get the relevant data
	SimulationHolder.Result[0];
	
	DxUDxArray=SimulationHolder.Result[0].DiagnosisCount.Count;
	TimeAxis=SimulationHolder.Result[0].DiagnosisCount.Time;
	
	// convert to a form that plot will accept
	PlotData=PlotStyles_ConvertDataToLinePlot(TimeAxis, DxUDxArray);
	//Set up plot appearance // http://www.pikemere.co.uk/blog/flot-tutorial-how-to-create-area-charts/ 
	PlotSettings={xaxis: {
					axisLabel: 'Time (years)',
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5,
					tickLength: 0
				},
				yaxis: {
					min: 0,
					axisLabel: 'Number of people',
					axisLabelUseCanvas: true,
					axisLabelFontSizePixels: 12,
					axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
					axisLabelPadding: 5
				},
				series: {
					lines: {
						show: true,
						fill: true
					},
					stack: true
				}
			};
	
	//plot of DxUDxPlotHolder
	$.plot("#DxUDxPlotHolder", PlotData, PlotSettings);

}


