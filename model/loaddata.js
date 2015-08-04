// There are two different types of global variables associated with loadin data
// DataFile: a structure that is used to store files themselves
// Data: a structure that is cleansed and passed to the simulation 
// LoadData is called at start 

function LoadData(){
	LoadDataFiles();
	ExtractDataFromFiles();
}


function LoadDataFiles(){
	DataFile.AgeSexNotifications=new CSVFile('./data/hcv_notifications_agesex.csv');
	DataFile.StateNotifications=new CSVFile('./data/hcv_notifications_state.csv');
	
	DataFile.MaleMortality=new CSVFile('./data/mortality_males_alltables_qx.csv');
	DataFile.FemaleMortality=new CSVFile('./data/mortality_females_alltables_qx.csv');
	DataFile.PWID=new CSVFile('./data/pwid_size.csv');
	DataFile.GeneralPopulation=new CSVFile('./data/generalpopulation.csv');
	
	DataFile.NSP=new CSVFile('./data/nspsurveydata.csv');

	DataFile.Assorted=new CSVFile('./data/assorteddata.csv');

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
		
	
	
	
	// Other assorted data
	console.log("Note that there is an additional data point for between 1985-2003 that we are yet to deal with, represented in the equations below as '2'");
	Data.Transplants={};
	var NoTransplantDataPoints = 11;
	Data.Transplants.Time=DataFile.Assorted.GetRow(116, 2, NoTransplantDataPoints);
	Data.Transplants.HCV=DataFile.Assorted.GetRow(120, 2, NoTransplantDataPoints);
	Data.Transplants.HCVHCC=DataFile.Assorted.GetRow(127, 2, NoTransplantDataPoints);
	Data.Transplants.Total=DataFile.Assorted.GetRow(132, 2, NoTransplantDataPoints);
	
	
	
	Data.HCVTreatment={};
	Data.HCVTreatment.Time=DataFile.Assorted.GetRow(149, 1, 13);
	Data.HCVTreatment.Count=DataFile.Assorted.GetRow(150, 1, 13);
	
	Data.NSW={};
	
	Data.NSW.HCVHCCDiagnoses={};
	Data.NSW.HCVHCCDiagnoses.Time=DataFile.Assorted.GetRow(156, 2, 17);
	Data.NSW.HCVHCCDiagnoses.Count=DataFile.Assorted.GetRow(158, 2, 17);
	
	Data.NSW.HCVMortality={};
	Data.NSW.HCVMortality.AllCause={};
	Data.NSW.HCVMortality.AllCause.Time=DataFile.Assorted.GetRow(164, 1, 21);
	Data.NSW.HCVMortality.AllCause.Count=DataFile.Assorted.GetRow(165, 1, 21);
	Data.NSW.HCVMortality.Liver={};
	Data.NSW.HCVMortality.Liver.Time=DataFile.Assorted.GetRow(164, 1, 15);
	Data.NSW.HCVMortality.Liver.Count=DataFile.Assorted.GetRow(166, 1, 15);
	
	
	Data.NSW.DecompenstedCirrhosis={};
	console.log("not sure if the DecompenstedCirrhosis is total living with or diagnoses");
	Data.NSW.DecompenstedCirrhosis.Diagnosed={};
	Data.NSW.DecompenstedCirrhosis.Diagnosed.Time=DataFile.Assorted.GetRow(172, 1, 20);
	Data.NSW.DecompenstedCirrhosis.Diagnosed.Count=DataFile.Assorted.GetRow(173, 1, 20);
	
	Data.NSW.DecompenstedCirrhosis.AdmittedToHospital={};
	Data.NSW.DecompenstedCirrhosis.AdmittedToHospital.Time=DataFile.Assorted.GetRow(172, 8, 22);
	Data.NSW.DecompenstedCirrhosis.AdmittedToHospital.Count=DataFile.Assorted.GetRow(174, 8, 22);
	
	Data.Incidence={};
	Data.Incidence.HITSC={};
	Data.Incidence.HITSC.Time=DataFile.Assorted.GetRow(178, 1, 4);
	Data.Incidence.HITSC.Rate=DataFile.Assorted.GetRow(179, 1, 4);
	Data.Incidence.HITSC.Rate=Divide(Data.Incidence.HITSC.Rate, 100);
	Data.Incidence.HITSC.RateLCI=DataFile.Assorted.GetRow(180, 1, 4);
	Data.Incidence.HITSC.RateLCI=Divide(Data.Incidence.HITSC.RateLCI, 100);
	Data.Incidence.HITSC.RateUCI=DataFile.Assorted.GetRow(181, 1, 4);
	Data.Incidence.HITSC.RateUCI=Divide(Data.Incidence.HITSC.RateLCI, 100);
	
	Data.Incidence.NSP={};
	Data.Incidence.NSP.Time=DataFile.Assorted.GetRow(187, 1, 3);
	Data.Incidence.NSP.TimeStart=DataFile.Assorted.GetRow(188, 1, 3);
	Data.Incidence.NSP.TimeEnd=DataFile.Assorted.GetRow(189, 1, 3);
	Data.Incidence.NSP.Rate=DataFile.Assorted.GetRow(192, 1, 3);
	Data.Incidence.NSP.Rate=Divide(Data.Incidence.NSP.Rate, 100);
	Data.Incidence.NSP.RateLCI=DataFile.Assorted.GetRow(193, 1, 3);
	Data.Incidence.NSP.RateLCI=Divide(Data.Incidence.NSP.RateLCI, 100);
	Data.Incidence.NSP.RateUCI=DataFile.Assorted.GetRow(194, 1, 3);
	Data.Incidence.NSP.RateUCI=Divide(Data.Incidence.NSP.RateLCI, 100);
	
	
}