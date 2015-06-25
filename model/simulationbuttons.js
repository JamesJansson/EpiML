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
	var ModelDirectory='model';
	// Load the values from the files
	ExtractDataFromFiles();
	
	// The following is required for all programs
	SimSettings.SampleFactor=Settings.SampleFactor;
	
	// Save into the Common holder
	var Common={};
	Common.Data=Data;
	Common.Param=[];//this where parameters that are the same between simulations are entered
	Common.Settings=SimSettings;
	
	//Creating the data to be used in the simulations
	// var Settings.RecalculateParam=true;
	var SimInputData=ParameterSplit(Param, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
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
	var ModelDirectory='model';

	// Load the values from the files
	ExtractDataFromFiles();
	
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
	var ParamArray=ParameterSplit(Param, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
	//Creating the simulation holder
	var TerminateOnFinish=false;
	SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateOnFinish); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	RunSettings.FunctionName="NotificationBackProjection";
	RunSettings.Common=Common;
	RunSettings.SimDataArray=ParamArray;
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
	var ModelDirectory='model';

	// Load the values from the files
	ExtractDataFromFiles();
	
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
	var ParamArray=ParameterSplit(Param, Settings.NumberOfSimulations, Settings.RecalculateParam);
	
	//Creating the simulation holder
	var TerminateOnFinish=false;
	SimulationHolder=new MultiThreadSim(ModelDirectory, Settings.NumberOfSimulations , Settings.NoThreads, TerminateOnFinish); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	
	var RunSettings={};
	RunSettings.FunctionName="SimSetup";
	RunSettings.Common=Common;
	RunSettings.SimDataArray=ParamArray;
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


function ExtractDataFromFiles(){
	Data.MaleNotifications={};
	Data.MaleNotifications.Table=DataFile.AgeSexNotifications.GetValues(4, 21, 1, 19);//get table indicates the range [rows][columns]
	Data.MaleNotifications.Age=DataFile.AgeSexNotifications.GetColumn(0, 4, 21);//GetColumn
	Data.MaleNotifications.Year=DataFile.AgeSexNotifications.GetRow(3, 1, 19);//GetRow
	
	Data.FemaleNotifications={};
	Data.FemaleNotifications.Table=DataFile.AgeSexNotifications.GetValues(25, 42, 1, 19);//get table indicates the range [rows][columns]
	Data.FemaleNotifications.Age=DataFile.AgeSexNotifications.GetColumn(0, 25, 42);//GetColumn
	Data.FemaleNotifications.Year=DataFile.AgeSexNotifications.GetRow(3, 1, 19);//GetRow	
	
	Data.StateNotifications={};
	Data.StateNotifications.Table=DataFile.StateNotifications.GetValues(29, 36, 1, 19);//get table indicates the range [rows][columns]
	Data.StateNotifications.State=DataFile.StateNotifications.GetColumn(0, 29, 36);//GetColumn
	Data.StateNotifications.Year=DataFile.StateNotifications.GetRow(3, 1, 19);//GetRow
	
	
	Data.Mortality={};
	Data.Mortality.Male=[];
	Data.Mortality.Male[1]={};
	Data.Mortality.Male[1].Year=1986;//The year which is used for the baseline
	Data.Mortality.Male[1].Rates=DataFile.MaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	Data.Mortality.Male[2]={};
	Data.Mortality.Male[2].Year=2006;//The year which is used for the baseline
	Data.Mortality.Male[2].Rates=DataFile.MaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]
	
	Data.Mortality.Female=[];
	Data.Mortality.Female[1]={};
	Data.Mortality.Female[1].Year=1986;//The year which is used for the baseline
	Data.Mortality.Female[1].Rates=DataFile.FemaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	Data.Mortality.Female[2]={};
	Data.Mortality.Female[2].Year=2006;//The year which is used for the baseline
	Data.Mortality.Female[2].Rates=DataFile.FemaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]


	Data.PWID={};
	Data.PWID.Year=DataFile.PWID.GetRow( 0, 1, 6);
	Data.PWID.AgeRange=DataFile.PWID.GetValues(25, 28, 0, 1);
	Data.PWID.Recent={};
	Data.PWID.Ever={};
	Data.PWID.Recent.Male=DataFile.PWID.GetValues(2, 5, 1, 6);
	Data.PWID.Recent.Female=DataFile.PWID.GetValues(12, 15, 1, 6);
	Data.PWID.Ever.Male=DataFile.PWID.GetValues(7, 10, 1, 6);
	Data.PWID.Ever.Female=DataFile.PWID.GetValues(17, 20, 1, 6);
	
	Data.GeneralPopulation={};
	Data.GeneralPopulation.Year=DataFile.GeneralPopulation.GetColumn(0, 1, 43);
	Data.GeneralPopulation.Size=DataFile.GeneralPopulation.GetColumn(1, 1, 43);
	Data.GeneralPopulation.Births=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Migration=DataFile.GeneralPopulation.GetColumn(2, 1, 43);
	Data.GeneralPopulation.Deaths=DataFile.GeneralPopulation.GetColumn(3, 1, 43);


	// Extract 
	var NoNSPDataPoints=19;
	Data.NSP={};
	Data.NSP.Year=DataFile.NSP.GetRow(0, 1, NoNSPDataPoints);
	
	// NSP sexual identity
	Data.NSP.SexId={};
	Data.NSP.SexId.Heterosexual=DataFile.NSP.GetRow(9, 1, NoNSPDataPoints);
	Data.NSP.SexId.Bisexual=DataFile.NSP.GetRow(10, 1, NoNSPDataPoints);
	Data.NSP.SexId.Homosexual=DataFile.NSP.GetRow(11, 1, NoNSPDataPoints);
	
	var SexIDCumulativeTotal=Add(Data.NSP.SexId.Heterosexual, Data.NSP.SexId.Bisexual);
	SexIDCumulativeTotal=Add(SexIDCumulativeTotal, Data.NSP.SexId.Homosexual);
	Data.NSP.SexId.Total=SexIDCumulativeTotal;
	
	// NSP HCV antibody total
	Data.NSP.HCVAntiBody={};
	Data.NSP.HCVAntiBody.Total={};
	Data.NSP.HCVAntiBody.Total.Tested=DataFile.NSP.GetRow(300, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Total.Positive=DataFile.NSP.GetRow(301, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Total.Proportion=Divide(Data.NSP.HCVAntiBody.Total.Positive, Data.NSP.HCVAntiBody.Total.Tested);
	
	// NSP HCV antibody male
	Data.NSP.HCVAntiBody.Male={};
	Data.NSP.HCVAntiBody.Male.AUnder25={};
	Data.NSP.HCVAntiBody.Male.AUnder25.Tested=DataFile.NSP.GetRow(305, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.AUnder25.Positive=DataFile.NSP.GetRow(306, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.AUnder25.Proportion=Divide(Data.NSP.HCVAntiBody.Male.AUnder25.Positive, Data.NSP.HCVAntiBody.Male.AUnder25.Tested);
	Data.NSP.HCVAntiBody.Male.A25to35={};
	Data.NSP.HCVAntiBody.Male.A25to35.Tested=DataFile.NSP.GetRow(307, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.A25to35.Positive=DataFile.NSP.GetRow(308, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.A25to35.Proportion=Divide(Data.NSP.HCVAntiBody.Male.A25to35.Positive, Data.NSP.HCVAntiBody.Male.A25to35.Tested);
	Data.NSP.HCVAntiBody.Male.A35plus={};
	Data.NSP.HCVAntiBody.Male.A35plus.Tested=DataFile.NSP.GetRow(309, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.A35plus.Positive=DataFile.NSP.GetRow(310, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Male.A35plus.Proportion=Divide(Data.NSP.HCVAntiBody.Male.A35plus.Positive, Data.NSP.HCVAntiBody.Male.A35plus.Tested);
	
	// NSP HCV antibody female
	Data.NSP.HCVAntiBody.Female={};
	Data.NSP.HCVAntiBody.Female.AUnder25={};
	Data.NSP.HCVAntiBody.Female.AUnder25.Tested=DataFile.NSP.GetRow(312, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.AUnder25.Positive=DataFile.NSP.GetRow(313, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.AUnder25.Proportion=Divide(Data.NSP.HCVAntiBody.Female.AUnder25.Positive, Data.NSP.HCVAntiBody.Female.AUnder25.Tested);
	Data.NSP.HCVAntiBody.Female.A25to35={};
	Data.NSP.HCVAntiBody.Female.A25to35.Tested=DataFile.NSP.GetRow(314, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.A25to35.Positive=DataFile.NSP.GetRow(315, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.A25to35.Proportion=Divide(Data.NSP.HCVAntiBody.Female.A25to35.Positive, Data.NSP.HCVAntiBody.Female.A25to35.Tested);
	Data.NSP.HCVAntiBody.Female.A35plus={};
	Data.NSP.HCVAntiBody.Female.A35plus.Tested=DataFile.NSP.GetRow(316, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.A35plus.Positive=DataFile.NSP.GetRow(317, 1, NoNSPDataPoints);
	Data.NSP.HCVAntiBody.Female.A35plus.Proportion=Divide(Data.NSP.HCVAntiBody.Female.A35plus.Positive, Data.NSP.HCVAntiBody.Female.A35plus.Tested);

	
	// Table 1.28 will provide very useful information that will allow us to determine a rate of infection and a decay rate for reduction risk activity of joining NSP
	
	
	
	// Methadone maintenance
	Data.NSP.Methadone={};
	Data.NSP.Methadone.Current=DataFile.NSP.GetRow(229, 1, NoNSPDataPoints);
	Data.NSP.Methadone.Previous=DataFile.NSP.GetRow(230, 1, NoNSPDataPoints);
	Data.NSP.Methadone.Never=DataFile.NSP.GetRow(231, 1, NoNSPDataPoints);
	var MethadoneTemp=Add(Data.NSP.Methadone.Current, Data.NSP.Methadone.Previous);
	Data.NSP.Methadone.Total=Add(MethadoneTemp, Data.NSP.Methadone.Never);
	
	Data.NSP.Methadone.CurrentProp=Divide(Data.NSP.Methadone.Current, Data.NSP.Methadone.Total);
	Data.NSP.Methadone.PreviousProp=Divide(Data.NSP.Methadone.Previous, Data.NSP.Methadone.Total);
	Data.NSP.Methadone.NeverProp=Divide(Data.NSP.Methadone.Never, Data.NSP.Methadone.Total);
		
	
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


