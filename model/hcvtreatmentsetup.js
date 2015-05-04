var HCVTreatmentArray=[];

function HCVTreatmentSetUp(){
	var TreatmentToAdd;
	
	TreatmentSettings={};
	TreatmentSettings.Name="pegylated interferon alpha 2a and ribavirin";
	TreatmentSettings.ShortName="PegIA2aRiba";
	TreatmentSettings.GeneralEfficacy=Param.HCV.Treatment.PegIA2aRiba.GeneralEfficacy;
	
	
	TreatmentToAdd=new HCVTreatment(TreatmentSettings);
	HCVTreatmentArray[TreatmentSettings.ShortName]=TreatmentToAdd;
	
	
	TreatmentSettings.Name="pegylated interferon alpha 2b and ribavirin";
	"Sofosbuvir ribavirin interferon"
	
	"ledipasvir and sofosbuvir"
	"simeprevir"
	
	
}