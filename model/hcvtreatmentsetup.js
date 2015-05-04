var HCVTreatmentArray=[];

function HCVTreatmentSetUp(){
	var TreatmentToAdd;
	
	// 
	var TS={};
	TS.Name="pegylated interferon alpha 2a and ribavirin";
	TS.ShortName="PegIA2aRiba";
	TS.Duration=48/52;
	
	TS.GeneralEfficacy=Param.HCV.Treatment.PegIA2aRiba.GeneralEfficacy;
	
	TS.GenotypeEfficacy=[];
	TS.GenotypeEfficacy['1']=Param.HCV.Treatment.PegIA2aRiba.GenotypeEfficacy.G1;
	
	TS.PatentExpires=2019.42; // PEG Int Alpha 2A + Ribavirin 29.5.2019
	
	TS.OnPatentCost=10000;
	TS.OffPatentCost=300;
		
	TS.AdverseEvents=function(Person, Time){};
	TS.Restrictions=function(Person, Time){};
	
	TreatmentToAdd=new HCVTreatment(TS);
	HCVTreatmentArray[TS.ShortName]=TreatmentToAdd;
	
	
	//TS.Name="pegylated interferon alpha 2b and ribavirin";
	//TS.Name="Sofosbuvir ribavirin interferon";
	
	//TS.Name="ledipasvir and sofosbuvir";
	//TS.Name="simeprevir";
	
	
	// PATENT LANDSCAPE REPORT FOR PEGYLATED INTERFERON ALFA 2A & 2B
	// Initiative for Medicines, Access & Knowledge (I-MAK)
	// PEG Int Alpha 2A 22.5.2017
	// PEG Int Alpha 2A + Ribavirin 29.5.2019
	// PEG Int Alpha 2B 28.4.2018
	
}