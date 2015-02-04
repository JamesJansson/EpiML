// This file contains the scripts that are called when the buttons on the interface are pressed.

// var SimulationHolder;
// var SimInputData=[];
// var Data={};
// var Param={};
// var CommonParam={};

function RunSim(){
	ScriptToRun='model/runnotificationsimulation.js';
	
	var NumberOfSimsToRun=20;//this will later be set by the preferences in the interface

	// Load the values from the files
	ExtractDataFromFiles();
	
	SimSettings={};
	SimSettings.RunOptimisation=true;
	// The following is required for all programs
	SimSettings.SampleFactor=Settings.SampleFactor;
	
	// Save into the Common holder
	var Common={};//
	Common.Data=Data;
	Common.Param=CommonParam;
	Common.Settings=SimSettings;
	
	// Load the values from the interface into the parameters
	// for (key in Param)
	// 		load the equivalent key in the interface
	// 		perform the relevant simulation based on the parameter type
	
	// In this step, we split out all parameters that have a unique simulation estimate
	// Param.Estimate[100] -> Param[100].Estimate
	
	//Creating the data to be used in the simulations
	SimInputData=[];
	for (i=0; i<NumberOfSimsToRun; i++){
		SimInputData[i]={};
		// At the moment there is no sim specific data
	}

	//Creating the parameter
	SimulationHolder=new MultiThreadSim(ScriptToRun, Common, SimInputData, Settings.NoThreads); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	SimulationHolder.FunctionToRunOnCompletion=NotificationSimPlot;
	
	
	SimulationHolder.Start();

	return 0;
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
	
	CommonParam.MaleMortality={};
	CommonParam.MaleMortality.Year1=1986;//The year which is used for the baseline
	CommonParam.MaleMortality.Rates1=DataFile.MaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	CommonParam.MaleMortality.Year2=2006;//The year which is used for the baseline
	CommonParam.MaleMortality.Rates2=DataFile.MaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]
	
	CommonParam.FemaleMortality={};
	CommonParam.FemaleMortality.Year1=1986;//The year which is used for the baseline
	CommonParam.FemaleMortality.Rates1=DataFile.FemaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	CommonParam.FemaleMortality.Year2=2006;//The year which is used for the baseline
	CommonParam.FemaleMortality.Rates2=DataFile.FemaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]

	Data.PWID={};
	Data.PWID.Year=DataFile.PWID.GetColumn( 0, 1, 6);
	Data.PWID.Recent={};
	Data.PWID.Ever={};
	Data.PWID.Recent.Male=DataFile.PWID.GetValues(2, 5, 1, 6);
	Data.PWID.Recent.Female=DataFile.PWID.GetValues(14, 17, 1, 6);
	Data.PWID.Ever.Male=DataFile.PWID.GetValues(9, 12, 1, 6);
	Data.PWID.Ever.Female=DataFile.PWID.GetValues(19, 22, 1, 6);
	
	
}


function NotificationSimPlot(){
	// Get the relevant data
	FibrosisArray=SimulationHolder.Result[0].FibrosisCount.Count;
	TimeAxis=SimulationHolder.Result[0].FibrosisCount.Time;
	
	// convert to a form that plot will accept
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


