

function StandardSettingsHCVOptimisation(){
	HCVOptSelector.NumberOfRounds=50;
	
	// create a list of parameters to optimise to
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsMale14_20");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsMale20_30");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsMale30_40");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsMale40_200");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsFemale14_20");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsFemale20_30");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsFemale30_40");
	HCVOptSelector.SelectDEOToOptimise("NumberEverInjectingDrugsFemale40_200");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsMale14_20");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsMale20_30");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsMale30_40");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsMale40_200");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsFemale14_20");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsFemale20_30");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsFemale30_40");
	HCVOptSelector.SelectDEOToOptimise("NumberRecentlyInjectingDrugsFemale40_200");
	
	HCVOptSelector.SelectDEOToOptimise("TotalNotificationsPlot");
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyProp");
	
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropMaleAUnder25");
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropMaleA25to35");
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropMaleA35plus");
	
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropFemaleAUnder25");
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropFemaleA25to35");
	HCVOptSelector.SelectDEOToOptimise("NSPHCVAntibodyPropFemaleA35plus");
	
	HCVOptSelector.SelectDEOToOptimise("IncidenceHITSC");
	HCVOptSelector.SelectDEOToOptimise("IncidenceNSP");
}