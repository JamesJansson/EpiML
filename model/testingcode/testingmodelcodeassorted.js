// important: this code is not to be included in the final product

// Working out the missing numbers
var RunningCount=SimulationHolder.Result[0].HCVDataDiagnosisResults[0].Penalty.InsufficientInfectedToDiagnose;
for (var i in SimulationHolder.Result[0].HCVDataDiagnosisResults){
	if (i>0){// skip the first
		RunningCount=Add(RunningCount, SimulationHolder.Result[0].HCVDataDiagnosisResults[i].Penalty.InsufficientInfectedToDiagnose);
	}
}


RunningCountCSV=new DownloadableCSV(RunningCount);
RunningCountCSV.Download();