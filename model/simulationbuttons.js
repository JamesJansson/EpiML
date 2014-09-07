// This file contains the scripts that are called when the buttons on the interface are pressed.

var SimulationHolder;
var SimInputData=[];
var Data={};
var Param={};

function RunSim(){
	ScriptToRun='model/runnotificationsimulation.js';
	
	var NumberOfSimsToRun=1;//this will later be set by the preferences in the interface

	// Load the values from the files
	LoadDataFromFiles();
	
	
	
	// Save into the Common holder
	var Common={};//
	Common.Data=Data;
	Common.Param=Param;
	
	//Creating the data to be used in the simulations
	SimInputData=[];
	for (i=0; i<NumberOfSimsToRun; i++){
		SimInputData[i]={};
		// At the moment there is no sim specific data
	}

	//Creating the parameter
	SimulationHolder=new MulticoreSim(ScriptToRun, Common, SimInputData, NoCores); //Common is the same between all sims
	SimulationHolder.UseSimProgressBar=true;
	SimulationHolder.SimProgressBarID="MainProgress";
	SimulationHolder.Start();

	return 0;
}

function LoadDataFromFiles(){
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
	
	Param.MaleMortality={};
	Param.MaleMortality.Year1=1986;//The year which is used for the baseline
	Param.MaleMortality.Rates1=DataFile.MaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	Param.MaleMortality.Year2=2006;//The year which is used for the baseline
	Param.MaleMortality.Rates2=DataFile.MaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]
	
	Param.FemaleMortality={};
	Param.FemaleMortality.Year1=1986;//The year which is used for the baseline
	Param.FemaleMortality.Rates1=DataFile.FemaleMortality.GetColumn( 13, 1, 101);//get table indicates the range [rows][columns]
	Param.FemaleMortality.Year2=2006;//The year which is used for the baseline
	Param.FemaleMortality.Rates2=DataFile.FemaleMortality.GetColumn( 17, 1, 101);//get table indicates the range [rows][columns]
}


function NotificationSimPlot(){
	// Get the relevant data
	SimulationHolder.Result[0];
	
	FibrosisArray=SimulationHolder.Result[0].FibrosisCount.Count;
	TimeAxis=SimulationHolder.Result[0].FibrosisCount.TimeVector;
	
	// convert to a form that plot will accept
	PlotData=HCVTestConvertDataToLinePlot(TimeAxis, FibrosisArray);
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
	
	//plot of HCVTestPlotHolder
	$.plot("#HCVTestPlotHolder", PlotData, PlotSettings);

}


