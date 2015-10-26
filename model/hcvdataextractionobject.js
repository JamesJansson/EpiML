// Note that this function is easier to edit in Notepad++ because functions can be collapsed


// This function is run internally in each instance of the model
function HCVDataExtractionObjects(){
	var GraphTime=AscendingArray(1970, 2020, 1);
	var DEO=[];//Array of DataExtractionObject
	
	var NSPErrorWeight=50;

	// Population sizes
	DEO.push(HCVDEO_NotificationsTotal(GraphTime));
	DEO.push(HCVDEO_EverInjectingDrugsTotal(GraphTime));
	DEO.push(HCVDEO_RecentInjectingDrugsTotal(GraphTime));
	
	// HCV infected population size
	DEO.push(HCVDEO_TotalActiveInfectionPlot(GraphTime));
	DEO.push(HCVDEO_NSPHCVAntibodyProp(GraphTime, NSPErrorWeight));
	DEO.push(HCVDEO_PropIDUInfectedPlot(GraphTime));
	
	// Disease stages
	DEO=DEO.concat(HCVDEO_Fibrosis(GraphTime));
	DEO.push(HCVDEO_HCCDiagnoses(GraphTime));
	
	// Entry into the population	
	DEO.push(HCVDEO_RecentlyBecameInjector(GraphTime));
	
	// Incidence
	DEO.push(HCVDEO_IncidenceHITSC(GraphTime));
	DEO.push(HCVDEO_IncidenceNSP(GraphTime));
	DEO.push(HCVDEO_IncidenceGeneral(GraphTime));
	
	// NSP size and demographics	
	DEO.push(HCVDEO_NSPParticipants(GraphTime));
	DEO.push(HCVDEO_HeterosexualNSPProp(GraphTime));
	DEO.push(HCVDEO_HomosexualNSPProp(GraphTime));
	DEO.push(HCVDEO_BisexualNSPProp(GraphTime));
	
	// Drug treatment
	DEO.push(HCVDEO_PropNSPCurrentMethdone(GraphTime));
	DEO.push(HCVDEO_PropNSPPreviousMethdone(GraphTime));
	DEO.push(HCVDEO_PropNSPNeverMethdone(GraphTime));
	
	// Transplants
	DEO.push(HCVDEO_HCVTransplants(GraphTime));
	
	// Treatement
	DEO.push(HCVDEO_HCVTreatment(GraphTime));
	
	// NSW based data
	DEO.push(HCVDEO_NumNSWHCVWithDecomp(GraphTime));
	DEO.push(HCVDEO_NumNSWHCVWithDecompAdmitted(GraphTime));
	DEO.push(HCVDEO_NSWHCCDiagnoses(GraphTime));
	DEO.push(HCVDEO_NSWHCVMortalityAllCause(GraphTime));
	DEO.push(HCVDEO_NSWHCVMortalityLiver(GraphTime));
	
	// Age and sex based extractions (for detailed analysis)
	DEO=DEO.concat(HCVDEO_NSPHCVAntibodyPropByAgeAndSex(GraphTime, NSPErrorWeight));
	DEO=DEO.concat(HCVDEO_NotificationsByAgeAndSex(GraphTime));
	DEO=DEO.concat(HCVDEO_EverInjectorsByAgeAndSex(GraphTime));
	DEO=DEO.concat(HCVDEO_RecentInjectorsByAgeAndSex(GraphTime));
	
	
	
	// for each element 
	// .SetGraphTime(GraphTime);

	return DEO;//Array of DataExtractionObject
}




// ******************************************************************************************************
// ******************************************************************************************************




function HCVDEO_NotificationsTotal(GraphTime){
	// This section deals with the display of total notifications in the simulations
	
	// Add all male notifications together
	var TotalMaleNotifications={};
	TotalMaleNotifications.Time=Data.MaleNotifications.Year;
	TotalMaleNotifications.Value=ZeroArray(Data.MaleNotifications.Year.length);
	for (var Count in Data.MaleNotifications.Table){
		TotalMaleNotifications.Value=Add(TotalMaleNotifications.Value, Data.MaleNotifications.Table[Count]);
	}
	// Add all female notifications together
	var TotalFemaleNotifications={};
	TotalFemaleNotifications.Time=Data.FemaleNotifications.Year;
	TotalFemaleNotifications.Value=ZeroArray(Data.FemaleNotifications.Year.length);
	for (var Count in Data.FemaleNotifications.Table){
		TotalFemaleNotifications.Value=Add(TotalFemaleNotifications.Value, Data.FemaleNotifications.Table[Count]);
	}
	
	// Add all notifications together
	var TotalNotifications={};
	TotalNotifications.Time=TotalMaleNotifications.Time;
	TotalNotifications.Value=Add(TotalMaleNotifications.Value, TotalFemaleNotifications.Value);
	
	// Create a new object to extract homosexual identity from NSP
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	NewDEO.SetData(TotalNotifications);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="TotalNotificationsPlot";
	NewDEO.Title="Total HCV Notifications";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of Notifications";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Notifications=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// Determine date of diagnosis
			var NotificationDate=Person.HCV.Diagnosed.FirstTimeOf(1);

			// If the person actually is diagnosed
			if (!isNaN(NotificationDate)){
				if (Time<=NotificationDate && NotificationDate<Time+1){
					Notifications++;
				}
			}
		}
		Notifications=Notifications*Settings.SampleFactor;
		return Notifications;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		// There is a value in the simulation results that indicates the shortfall in the number of notifications
		// This value is calculated by age group
		
		var TotalPenalty=0;
		var TotalInsufficientInfected=0;
		var TotalInsufficientSymptomatic=0;
		for (var Count in SimulationResult.HCVDataDiagnosisResults){
			var Pen=SimulationResult.HCVDataDiagnosisResults[Count].Penalty;
			TotalInsufficientInfected+=Pen.InsufficientInfectedToDiagnoseTotal;
			// TotalInsufficientSymptomatic+=Pen.InsufficientSymptomaticDiagnosesTotal;
			TotalPenalty+=Pen.InsufficientInfectedToDiagnoseTotal;//+Pen.InsufficientSymptomaticDiagnosesTotal;
		}
		
		console.log("Total penalty for notifications: "+TotalPenalty);
		console.log("Penalty for InsufficientInfectedToDiagnose: "+TotalInsufficientInfected);
		console.log("Penalty for InsufficientSymptomaticDiagnoses: "+TotalInsufficientSymptomatic);
		console.log("Need to determine how much of a shortfall this is");
		
		return TotalPenalty*Settings.SampleFactor;
	};
	
	
	NewDEO.Optimisation.Weight=1000;
	
	return NewDEO;
}




function HCVDEO_EverInjectingDrugsTotal(GraphTime){
	// This section deals with the creation of summary statistics for total ever injectors
	var NewDEO=new DataExtractionObject();
	NewDEO.CountType="Instantaneous";
	NewDEO.Name="NumberEverInjectingDrugsTotal";
	NewDEO.Title="Number of people ever injecting drugs (Total)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Count";
	var DataStruct={};
	DataStruct.Time=Data.PWID.Year;
	DataStruct.Value=0;// This starts as a number but becomes a vector when summing the first vector ti
	var MaleEverIDUTotal=Sum(Data.PWID.Ever.Male);
	var FemaleEverIDUTotal=Sum(Data.PWID.Ever.Female);
	DataStruct.Value=Add(MaleEverIDUTotal, FemaleEverIDUTotal);

	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.ResultFunction=function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Alive(Time)){
					if (Person.IDU.EverInjectedAtTime(Time)){
						MatchCount++;
					}
				}
			}
			MatchCount=MatchCount*Settings.SampleFactor;
			return MatchCount;
		};
	return NewDEO;
}




function HCVDEO_RecentInjectingDrugsTotal(GraphTime){
	// This section deals with the creation of summary statistics for total recent injectors
	var NewDEO=new DataExtractionObject();
	NewDEO.CountType="Instantaneous";
	NewDEO.Name="NumberRecentlyInjectingDrugsTotal";
	NewDEO.Title="Number of people recently injecting drugs (Total)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Count";
	var DataStruct={};
	DataStruct.Time=Data.PWID.Year;
	DataStruct.Value=0;// This starts as a number but becomes a vector when summing the first vector ti
	var MaleRecentIDUTotal=Sum(Data.PWID.Recent.Male);
	var FemaleRecentIDUTotal=Sum(Data.PWID.Recent.Female);
	DataStruct.Value=Add(MaleRecentIDUTotal, FemaleRecentIDUTotal);

	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.ResultFunction=function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Alive(Time)){
					if (Person.IDU.InjectedBetween(Time-1, Time)){
						MatchCount++;
					}
				}
			}
			MatchCount=MatchCount*Settings.SampleFactor;
			return MatchCount;
		};
	return NewDEO;
}




function HCVDEO_RecentlyBecameInjector(GraphTime){
// This section deals with the entry of new injectors into the population
	
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=[];
	DataStruct.Value=[];
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="RecentlyBecameInjector";
	NewDEO.Title="Number of people who initiate injecting by year";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Count=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.IDU.EverInjectedAtTime(Time)==false && Person.IDU.EverInjectedAtTime(Time+1)){
					Count++;
				}
			}
		}
		
		return Count*Settings.SampleFactor;
	};
	
	// Set optimisation
	NewDEO.Optimise=false;
	NewDEO.Optimisation.ProportionalError=false;
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}




function HCVDEO_NSPParticipants(GraphTime){
	// This section deals with the creation of summary statistics for NSP survey data
	var NewDEO=new DataExtractionObject();
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPParticipants";
	NewDEO.Title="Total in NSP";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
				}
			}
		}
		return NSPTotal*Settings.SampleFactor;
	};
	
	return NewDEO;
}

	
	
	
function HCVDEO_HeterosexualNSPProp(GraphTime){
	// Create a new object to extract heterosexual identity from NSP
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Divide(Data.NSP.SexId.Heterosexual, Data.NSP.SexId.Total);
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HeterosexualNSPProp";
	NewDEO.Title="Proportion of NSP Heterosexual";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Heterosexual=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				//if (Person.IDU.NSP.Value(Time)){
				if (Person.IDU.CurrentlyInjecting(Time)){
					NSPTotal++;
					// Check if Heterosexual
					if (Person.Sexuality==1){
						Heterosexual++;
					}
				}
			}
		}
		return Heterosexual/NSPTotal;
	};
	
	NewDEO.Optimisation.ProportionalError=true;   // check that this works correctly

	return NewDEO;
}




function HCVDEO_HomosexualNSPProp(GraphTime){
	// Create a new object to extract homosexual identity from NSP
	NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Divide(Data.NSP.SexId.Homosexual, Data.NSP.SexId.Total);
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HomosexualNSPProp";
	NewDEO.Title="Proportion of NSP Homosexual";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Homosexual=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				//if (Person.IDU.NSP.Value(Time)){
				if (Person.IDU.CurrentlyInjecting(Time)){
					NSPTotal++;
					// Check if homosexual
					if (Person.Sexuality==2){
						Homosexual++;
					}
				}
			}
		}
		return Homosexual/NSPTotal;
	};
	
	NewDEO.Optimisation.ProportionalError=true;
	
	return NewDEO;
}
	
	
	

function HCVDEO_BisexualNSPProp(GraphTime){
	// Create a new object to extract bisexual identity from NSP
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Divide(Data.NSP.SexId.Bisexual, Data.NSP.SexId.Total);
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="BisexualNSPProp";
	NewDEO.Title="Proportion of NSP Bisexual";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Bisexual=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				// if (Person.IDU.NSP.Value(Time)){
				if (Person.IDU.CurrentlyInjecting(Time)){
					NSPTotal++;
					// Check if bisexual
					if (Person.Sexuality==3){
						Bisexual++;
					}
				}
			}
		}
		return Bisexual/NSPTotal;
	};

	NewDEO.Optimisation.ProportionalError=true;
	
	return NewDEO;
}




function HCVDEO_TotalActiveInfectionPlot(GraphTime){
	// Display of infections (no data)
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="TotalActiveInfectionPlot";
	NewDEO.Title="Total People Living with Active HCV Infection";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var TotalInfected=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.HCV.CurrentlyInfected(Time)){
					TotalInfected++;
				}
			}
		}
		TotalInfected=TotalInfected*Settings.SampleFactor;
		return TotalInfected;
	};
	
	return NewDEO;
}
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// HCV prevalence in IDU - HCV prevalence in NSP users



function HCVDEO_NSPHCVAntibodyProp(GraphTime, NSPErrorWeight){
	var NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Total.Proportion;// NSP HCV antibody prevalence
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyProp";
	NewDEO.Title="Proportion of NSP with HCV Antibodies";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
					// Check if Heterosexual
					if (Person.HCV.AntibodyPresent(Time)){
						AntibodyPresent++;
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	
	return NewDEO;
}



	
function HCVDEO_NSPHCVAntibodyPropByAgeAndSex(GraphTime, NSPErrorWeight){
	// ******************************************************************************************************
	// Returns an array of HCV prevalence in NSP by age and sex
	var DEO=[];
	
	// Males under 25
	var NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Male.AUnder25.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropMaleAUnder25";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Male, <25)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)<25){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// Males 25-35
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Male.A25to35.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropMaleA25to35";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Male, 25-35)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)>=25 && Person.Age(Time)<35 ){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
		
	// Males over 35
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Male.A35plus.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropMaleA35plus";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Male, >35)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)>=35){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// Females under 25
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Female.AUnder25.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropFemaleAUnder25";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Female, <25)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)<25){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// Females 25-35
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Female.A25to35.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropFemaleA25to35";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Female, 25-35)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)>=25 && Person.Age(Time)<35 ){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
		
	// Females over 35
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Female.A35plus.Proportion;
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVAntibodyPropFemaleA35plus";
	NewDEO.Title="Proportion of NSP with HCV Antibodies (Female, >35)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.Age(Time)>=35){
					// Check if currently injecting
					if (Person.IDU.CurrentlyInjecting(Time)){
						NSPTotal++;
						// Check if Heterosexual
						if (Person.HCV.AntibodyPresent(Time)){
							AntibodyPresent++;
						}
					}
				}
			}
		}
		
		this.AddErrorWeight(NSPTotal);
		
		var Prop= AntibodyPresent/NSPTotal;
		if (isNaN(Prop)){
			Prop=0;
		}
		return Prop;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfCases, ExpectedNumberOfCases)));
		return TotalError;
	};
	NewDEO.Optimisation.Weight=NSPErrorWeight;
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	return DEO;
}




function HCVDEO_PropIDUInfectedPlot(GraphTime){
	// HCV prevalence in all IDU - Display of infections (no data)
	var NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="PropIDUInfectedPlot";
	NewDEO.Title="Proportion of IDU with HCV Antibodies";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var TotalInfected=0;
		var TotalInjecting=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// Check if CurrentlyInjecting
			if (Person.Alive(Time) ){
				if (Person.IDU.CurrentlyInjecting(Time)){
					TotalInjecting++;
					// Check if CurrentlyInfected
					if (Person.HCV.CurrentlyInfected(Time)){
						TotalInfected++;
					}
				}
			}
		}
		return TotalInfected/TotalInjecting;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		// There is a value in the simulation results that indicates the shortfall in the number of notifications
		// This value is calculated by age group
		return 0;
	};
	return NewDEO;
}




function HCVDEO_PropNSPCurrentMethdone(GraphTime){
	// NSP in methadone maintenance
	
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.Methadone.CurrentProp;
	NewDEO.SetData(DataStruct);
	
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="PropNSPCurrentMethdone";
	NewDEO.Title="Proportion of NSP currently in methadone maintenance treatment";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
					// Check if Heterosexual
					if (Person.HCV.AntibodyPresent(Time)){
						AntibodyPresent++;
					}
				}
			}
		}
		
		
		return 0;
	};
	console.log("Not currently extracting");

	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}


	
	
function HCVDEO_PropNSPPreviousMethdone(GraphTime){
	// Proportion previously 
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.Methadone.PreviousProp;
	NewDEO.SetData(DataStruct);
	
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="PropNSPPreviousMethdone";
	NewDEO.Title="Proportion of NSP previously in methadone maintenance treatment";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
					// Check if Heterosexual
					if (Person.HCV.AntibodyPresent(Time)){
						AntibodyPresent++;
					}
				}
			}
		}
		
		
		return 0;
	};
	console.error("Not currently extracting");
	// Set optimisation
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}




function HCVDEO_PropNSPNeverMethdone(GraphTime){
	// Proportion never 
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.Methadone.NeverProp;
	NewDEO.SetData(DataStruct);
	
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="PropNSPNeverMethdone";
	NewDEO.Title="Proportion of NSP never in methadone maintenance treatment";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var AntibodyPresent=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
					// Check if Heterosexual
					if (Person.HCV.AntibodyPresent(Time)){
						AntibodyPresent++;
					}
				}
			}
		}
		
		return 0;
	};
	console.error("Not currently extracting");
	// Set optimisation
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}	
	
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// Fibrosis staging in all PLHCV
function HCVDEO_Fibrosis(GraphTime){	
	var DEO=[];
	// F0
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithF0";
	NewDEO.Title="Number of people with HCV - F0";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==0){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);	
	
	
	// F1
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithF1";
	NewDEO.Title="Number of people with HCV - F1";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==1){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);	
	
	
	// F2
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithF2";
	NewDEO.Title="Number of people with HCV - F2";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==2){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// F3
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithF3";
	NewDEO.Title="Number of people with HCV - F3";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==3){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// F4
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithF4";
	NewDEO.Title="Number of people with HCV - F4";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==4){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	// Liver failure
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumHCVWithLF";
	NewDEO.Title="Number of people with HCV - LiverFailure";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					if (Person.HCV.Fibrosis.Value(Time)==5){
						Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	return DEO;
}	



	
function HCVDEO_HCVTransplants(GraphTime){	
	// Transplants
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.Transplants.Time;
	DataStruct.Value=Data.Transplants.HCV;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HCVTransplants";
	NewDEO.Title="Transplants in people with an HCV infection";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			
			// determine if the person had a transplant during the period
		}
		return Total*Settings.SampleFactor;
	};
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}
	
	
	
	
function HCVDEO_HCVTreatment(GraphTime){	
	// Treatment
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.HCVTreatment.Time;
	DataStruct.Value=Data.HCVTreatment.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HCVTreatment";
	NewDEO.Title="Treatment for HCV";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time) ){
				
			}
			// determine if the person initiated treatment during the period
		}
		return Total*Settings.SampleFactor;
	};
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}
	
	
	
	
function HCVDEO_NumNSWHCVWithDecomp(GraphTime){
	// NSW Decompensted Cirrhosis
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.DecompenstedCirrhosis.Diagnosed.Time;
	DataStruct.Value=Data.NSW.DecompenstedCirrhosis.Diagnosed.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumNSWHCVWithDecomp";
	NewDEO.Title="Number of people in NSW with HCV - Decompensted Cirrhosis";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					/////// CHECK THE STATE IN THIS SECTION
					
					
					
					if (Person.HCV.Fibrosis.Value(Time)==5){
						Total++;
					}
				}
			}
		}
		var PropNSW=Sum(Data.StateNotifications.Table[1])/Sum(Data.StateNotifications.Table);
		
		return Total*Settings.SampleFactor*PropNSW;
	};
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}

	
	
	
function HCVDEO_NumNSWHCVWithDecompAdmitted(GraphTime){
	// NSW Decompensted Cirrhosis admitted to hospital
	NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.DecompenstedCirrhosis.AdmittedToHospital.Time;
	DataStruct.Value=Data.NSW.DecompenstedCirrhosis.AdmittedToHospital.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NumNSWHCVWithDecompAdmitted";
	NewDEO.Title="Number of people admitted in NSW with HCV - Decompensted Cirrhosis";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				if (Person.HCV.CurrentlyInfected(Time)){
					/////// CHECK THE STATE IN THIS SECTION
					
					/////// CHECK IF THE PERSON ATTENDS HOSPITAL IN THIS TIME
					
					if (Person.HCV.Fibrosis.Value(Time)==5){
						//Total++;
					}
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	return NewDEO;
}		



	
function HCVDEO_NSWHCCDiagnoses(GraphTime){	
	// NSW HCC diagnoses
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.HCVHCCDiagnoses.Time;
	DataStruct.Value=Data.NSW.HCVHCCDiagnoses.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSWHCCDiagnoses";
	NewDEO.Title="HCC diagnoses of people with HCV in NSW";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of HCV cases (NSW)";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// determine if the person is currently alive
			if (Person.Alive(Time) ){
				// determine if the person is diagnosed with HCC during the period
				if (Person.HCV.HCC.Value(Time)==1){
					Total++;
				}
			}
		}
		// determine if the person is in NSW
		var PropNSW=Sum(Data.StateNotifications.Table[1])/Sum(Data.StateNotifications.Table);
		
		return Total*Settings.SampleFactor*PropNSW;
	};
	
	return NewDEO;
}




function HCVDEO_HCCDiagnoses(GraphTime){	
	// NSW HCC diagnoses
	var NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HCCDiagnoses";
	NewDEO.Title="HCC diagnoses of people with HCV (Total)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of HCV cases";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// determine if the person is currently alive
			if (Person.Alive(Time) ){
				// determine if the person is diagnosed with HCC during the period
				if (Person.HCV.HCC.Value(Time)==1){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	return NewDEO;
}




function HCVDEO_NSWHCVMortalityAllCause(GraphTime){	
	// NSW HCV mortality
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.HCVMortality.AllCause.Time;
	DataStruct.Value=Data.NSW.HCVMortality.AllCause.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSWHCVMortalityAllCause";
	NewDEO.Title="All cause mortality of people with HCV diagnosis in NSW";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// determine if the person dies during this period
			if (Person.Alive(Time)==true && Person.Alive(Time+1)==false){
				// determine if the person is has ever had a HCV diagnosis by that point in time
				if (Person.HCV.Diagnosed.Value(Time)==1){
					// determine if the person is in NSW
					Total++;
				}
			}
		}
		var PropNSW=Sum(Data.StateNotifications.Table[1])/Sum(Data.StateNotifications.Table);
		
		return Total*Settings.SampleFactor*PropNSW;
	};
	
	return NewDEO;
}




function HCVDEO_NSWHCVMortalityLiver(GraphTime){	
	// NSW HCV liver mortality
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.HCVMortality.Liver.Time;
	DataStruct.Value=Data.NSW.HCVMortality.Liver.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSWHCVMortalityLiver";
	NewDEO.Title="Liver mortality of people with HCV diagnosis in NSW";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Total=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// determine if the person dies during this period
			if (Person.Alive(Time)==true && Person.Alive(Time+1)==true){
				// determine if the person is has ever had a HCV diagnosis by that point in time
				if (Person.HCV.Diagnosed.Value(Time)==1){
			// determine if the person dies during this period due to liver issues
			
			// determine if the person is in NSW
				}
			}
		}
		var PropNSW=Sum(Data.StateNotifications.Table[1])/Sum(Data.StateNotifications.Table);
		
		return Total*Settings.SampleFactor*PropNSW;
	};
	
	return NewDEO;
}	
	
	
	

function HCVDEO_IncidenceHITSC(GraphTime){	
	// Incidence HITS-C
	var NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.Incidence.HITSC.Time;
	DataStruct.Value=Data.Incidence.HITSC.Rate;
	
	// Load the data into the function 
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="IncidenceHITSC";
	NewDEO.Title="Incidence (as predicted by HITS-C)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var SamplePopulationSize=0;// weight for the current time
		var NumberOfSeroconversions=0;
		
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// Check if CurrentlyInjecting
			if (Person.IDU.CurrentlyInjecting(Time)){
				if (Person.HCV.CurrentlyInfected(Time)==false){
					SamplePopulationSize++;
					// Determine if the person had a serconversion in the period
					if(Person.HCV.CurrentlyInfected(Time+1)==true){
						NumberOfSeroconversions++
					}
				}
			}
		}
		
		var SimulatedIncidenceRate=NumberOfSeroconversions/SamplePopulationSize;
		
		if (isNaN(SimulatedIncidenceRate)){
			SimulatedIncidenceRate=0;
		}
		
		// This is a sneaky bit that will allow the count to be maintained
		this.AddErrorWeight(SamplePopulationSize*Settings.SampleFactor);
		
		return SimulatedIncidenceRate;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		var ExpectedNumberOfNewCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfNewCases=Multiply(SimulationValueArray, this.ErrorWeight);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfNewCases, ExpectedNumberOfNewCases)));
		
		return TotalError;
	};
	
	NewDEO.Optimisation.Weight=5;
	
	return NewDEO;
}
	
	
	
	
function HCVDEO_IncidenceNSP(GraphTime){		
	// Incidence NSP
	NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.Incidence.NSP.Time;
	DataStruct.Value=Data.Incidence.NSP.Rate;
	
	// Load the data into the function 
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="IncidenceNSP";
	NewDEO.Title="Incidence (as predicted by NSP)";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var SamplePopulationSize=0;// weight for the current time
		var NumberOfSeroconversions=0;
		
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// Check if CurrentlyInjecting
			if (Person.IDU.CurrentlyInjecting(Time)){
				if (Person.HCV.CurrentlyInfected(Time)==false){
					SamplePopulationSize++;
					// Determine if the person had a serconversion in the period
					if(Person.HCV.CurrentlyInfected(Time+1)==true){
						NumberOfSeroconversions++
					}
				}
			}
		}
		
		var SimulatedIncidenceRate=NumberOfSeroconversions/SamplePopulationSize;
		
		if (isNaN(SimulatedIncidenceRate)){
			SimulatedIncidenceRate=0;
		}
		
		// This is a sneaky bit that will allow the count to be maintained
		this.AddErrorWeight(SamplePopulationSize*Settings.SampleFactor);
		
		return SimulatedIncidenceRate;
	};
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		
		console.log("DataArray, SimulationValueArray, ErrorWeight");
		console.log(DataArray);
		console.log(SimulationValueArray);
		console.log(this.ErrorWeight);
		
		
		var ExpectedNumberOfNewCases=Multiply(DataArray, this.ErrorWeight);
		var SimulatedNumberOfNewCases=Multiply(SimulationValueArray, this.ErrorWeight);

		console.log("ExpectedNumberOfNewCases, SimulatedNumberOfNewCases");
		console.log(ExpectedNumberOfNewCases);
		console.log(SimulatedNumberOfNewCases);
		var TotalError=Sum(Abs(Minus(SimulatedNumberOfNewCases, ExpectedNumberOfNewCases)));
		
		return TotalError;
	};
	NewDEO.Optimisation.Weight=5;
	
	return NewDEO;
}	




function HCVDEO_IncidenceGeneral(GraphTime){	
	// Incidence NSP (not fit)
	NewDEO=new DataExtractionObject();
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="IncidenceGeneral";
	NewDEO.Title="Incidence";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var NumberOfSeroconversions=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			// Check if CurrentlyInjecting
			if (Person.IDU.CurrentlyInjecting(Time)){
				if (Person.HCV.CurrentlyInfected(Time)==false){
					// Determine if the person had a serconversion in the period
					if(Person.HCV.CurrentlyInfected(Time+1)==true){
						NumberOfSeroconversions++
					}
				}
			}
		}
		return NumberOfSeroconversions*Settings.SampleFactor;
	};
	
	// Add the object to the array of all ODEOS
	return NewDEO;
}

	
	

function HCVDEO_NotificationsByAgeAndSex(GraphTime){	
	// This section deals with the number of notifications by age group returns an array of these DEOs
	
	function CreateNotificationByAgeSexFunction(SexValue, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			var Notifications=0;
				for (var PersonCount in SimulationResult.Population){
					var Person=SimulationResult.Population[PersonCount];
					// Determine date of diagnosis
					var NotificationDate=Person.HCV.Diagnosed.FirstTimeOf(1);
					
					// If the person actually is diagnosed
					if (!isNaN(NotificationDate)){
						if (Time<=NotificationDate && NotificationDate<Time+1){
							if (Person.Sex==SexValue){
								if (LowerAge<=Person.Age(NotificationDate) && Person.Age(NotificationDate)<UpperAge){
									Notifications++;
								}
							}
						}
					}
				}
				Notifications=Notifications*Settings.SampleFactor;
				return Notifications;
		};
		return FunctionHolder;
	}
	
	
	var DEO=[];
	
	for (var TempSexValue=0; TempSexValue<2; TempSexValue++){
		if (TempSexValue==0){
			var CurrentSexNotificationData=Data.MaleNotifications;
			var SexName="Male";
		}
		else{
			var CurrentSexNotificationData=Data.FemaleNotifications;
			var SexName="Female";
		}
		for (var Count in CurrentSexNotificationData.Age){
			Count=Number(Count);
			var TempHCVSexAgeNotification={};
			TempHCVSexAgeNotification.Value=CurrentSexNotificationData.Table[Count];
			TempHCVSexAgeNotification.Time=CurrentSexNotificationData.Year;
			
			var TempAgeLower=CurrentSexNotificationData.Age[Count];
			var TempAgeUpper=CurrentSexNotificationData.Age[Count+1];
			
			
			if (typeof(TempAgeUpper)=="undefined"){
				TempAgeUpper=200;
			}
			
			NewDEO=new DataExtractionObject();
	
			// Load the data into the function 
			NewDEO.SetData(TempHCVSexAgeNotification);
			NewDEO.SetGraphTime(GraphTime);
			NewDEO.Name="TotalNotificationsPlot"+SexName+TempAgeLower;
			NewDEO.Title=SexName+" HCV Notifications "+TempAgeLower+"-"+TempAgeUpper;
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Number of Notifications";
			
			// Set the result function using the function above.
			NewDEO.ResultFunction= CreateNotificationByAgeSexFunction(TempSexValue, TempAgeLower, TempAgeUpper);
			
			DEO.push(NewDEO);
		}
	}
	return DEO;
}	
	
	
	
	
function HCVDEO_EverInjectorsByAgeAndSex(GraphTime){	
// This section deals with the creation of summary statistics for ever injectors


	// From this section onwards, the simulation determines the total number of injectors by age and sex
	function CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Sex==Sex){
					if (Person.Alive(Time)){
						if (Person.IDU.EverInjectedAtTime(Time)){
							if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge){
								MatchCount++;
							}
						}
					}
				}
			}
			MatchCount=MatchCount*Settings.SampleFactor;
			return MatchCount;
		};
		return FunctionHolder;
	}

	var DEO=[];
	for (var Sex=0; Sex<2; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[AgeIndex][0];
			var UpperAge=Data.PWID.AgeRange[AgeIndex][1];
			var EverInjectorByAgeFunction=CreateEverInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new DataExtractionObject();
			NewDEO.CountType="Instantaneous";
			// Name the Statistic and give labels
			var SexText;
			if (Sex==0){
				SexText="Male"; 
			}
			else {
				SexText="Female"; 
			}
			
			var ObjectName="NumberEverInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
			NewDEO.Name=ObjectName;
			
			NewDEO.Title="Number of people ever injecting drugs ("+SexText+", "+LowerAge+"-"+UpperAge+")";
			
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Count";
			
			// Load the data into the function 
			var DataStruct={};
			DataStruct.Time=Data.PWID.Year;
			if (Sex==0){
				DataStruct.Value=Data.PWID.Ever.Male[AgeIndex];
			}
			else {
				DataStruct.Value=Data.PWID.Ever.Female[AgeIndex];
			}
			
			NewDEO.SetData(DataStruct);
			NewDEO.SetGraphTime(GraphTime);
			NewDEO.ResultFunction=EverInjectorByAgeFunction;
			
			// Set optimisation
			// 
			// NewDEO.Optimisation.ProportionalError=true;
			// NewDEO.Optimisation.Weight=10;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}
	return DEO;
}




function HCVDEO_RecentInjectorsByAgeAndSex(GraphTime){	
// This section deals with the creation of summary statistics for recent injectors
	var DEO=[];
	
	function CreateRecentInjectorByAgeFunction(Sex, LowerAge, UpperAge){
		// not that this uses closures to limit the scope of LowerAge and UpperAge so that the function can be generalised
		var FunctionHolder= function (SimulationResult, Time){
			var MatchCount=0;
			for (var PersonCount in SimulationResult.Population){
				var Person=SimulationResult.Population[PersonCount];
				if (Person.Sex==Sex){
					if (Person.Alive(Time)){
						if (Person.IDU.InjectedBetween(Time-1, Time)){
							if (LowerAge<=Person.Age(Time) && Person.Age(Time)<UpperAge){
								MatchCount++;
							}
						}
					}
				}
			}
			MatchCount=Multiply(MatchCount, Settings.SampleFactor);
			return MatchCount;
		};
		return FunctionHolder;
	}

	var DEO;
	for (var Sex=0; Sex<2; Sex++){
		for (var AgeIndex in Data.PWID.AgeRange){
			var LowerAge=Data.PWID.AgeRange[AgeIndex][0];
			var UpperAge=Data.PWID.AgeRange[AgeIndex][1];
			var RecentInjectorByAgeFunction=CreateRecentInjectorByAgeFunction(Sex, LowerAge, UpperAge);
			
			
			var NewDEO=new DataExtractionObject();
			NewDEO.CountType="Instantaneous";
			// Name the Statistic and give labels
			var SexText;
			if (Sex==0){
				SexText="Male"; 
			}
			else {
				SexText="Female"; 
			}
			
			var ObjectName="NumberRecentlyInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
			NewDEO.Name=ObjectName;
			
			NewDEO.Title="Number of people recently injecting drugs ("+SexText+", "+LowerAge+"-"+UpperAge+")";
			
			NewDEO.XLabel="Year";
			NewDEO.YLabel="Count";
			
			// Load the data into the function 
			var DataStruct={};
			DataStruct.Time=Data.PWID.Year;
			if (Sex==0){
				DataStruct.Value=Data.PWID.Recent.Male[AgeIndex];
			}
			else {
				DataStruct.Value=Data.PWID.Recent.Female[AgeIndex];
			}
			
			NewDEO.SetData(DataStruct);
			NewDEO.SetGraphTime(GraphTime);
			NewDEO.ResultFunction=RecentInjectorByAgeFunction;
			
			// Set optimisation
			// 
			// NewDEO.Optimisation.ProportionalError=true;
			// NewDEO.Optimisation.Weight=10;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}
	return DEO;
}
	
	
	
	
	
	
	

