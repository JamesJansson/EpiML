// Elements to optimise to
// TotalNotificationsPlot
// NSPHCVAntibodyProp
// IncidenceHITSC
//



// This function is run internally in each instance of the model
function HCVDataExtractionObjects(){
	var GraphTime=AscendingArray(1970, 2020, 1);
	var DEO=[];//Array of DataExtractionObject

	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
	// This section deals with the creation of summary statistics for ever injectors
	
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
	var FemaleEverIDUTotal=Sum(Data.PWID.Ever.Male);
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
	DEO.push(NewDEO);


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
			// NewDEO.Optimise=true;
			// NewDEO.Optimisation.ProportionalError=true;
			// NewDEO.Optimisation.Weight=10;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}
	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
// This section deals with the creation of summary statistics for recent injectors

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
			// NewDEO.Optimise=true;
			// NewDEO.Optimisation.ProportionalError=true;
			// NewDEO.Optimisation.Weight=10;
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}

// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
// This section deals with the entry of new injectors into the population
	
	NewDEO=new DataExtractionObject();
	
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
	DEO.push(NewDEO);





	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
// This section deals with the creation of summary statistics for NSP survey data




	// Create a new object to extract heterosexual identity from NSP
	NewDEO=new DataExtractionObject();
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
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);










	
	
	// Create a new object to extract heterosexual identity from NSP
	NewDEO=new DataExtractionObject();
	
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
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
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
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
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
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
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
	NewDEO=new DataExtractionObject();
	
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
		
		// 
		//console.log(SimulationResult);
		
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	// This section deals with the number of notifications by age group
	
	
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
			
			
			var SexValue=Number(TempSexValue);
			var AgeLower=Number(TempAgeLower);
			var AgeUpper=Number(TempAgeUpper);
			
			NewDEO.ResultFunction= CreateNotificationByAgeSexFunction(TempSexValue, TempAgeLower, TempAgeUpper);
			
			DEO.push(NewDEO);
		}
	}
	
	
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// This section deals with the display of all notifications in the simulations
	
	
	// NewDEO.ErrorFunction=function(){	return 0;};
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// Display of infections (no data)
	NewDEO=new DataExtractionObject();
	
	var EmptyData={};
	EmptyData.Value=[];
	EmptyData.Time=[];
	
	// Load the data into the function 
	NewDEO.SetData(EmptyData);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="TotalInfectedPlot";
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
	
	NewDEO.ErrorFunction=function(TimeArray, DataArray, SimulationValueArray, SimulationResult){
		// There is a value in the simulation results that indicates the shortfall in the number of notifications
		// This value is calculated by age group
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// HCV prevalence in IDU - HCV prevalence in NSP users
	
	var NSPErrorWeight=50;
	
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Total.Proportion;// NSP HCV antibody prevalence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
	
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	// ******************************************************************************************************
	// HCV prevalence in NSP by age and sex
	
	// Males under 25
	NewDEO=new DataExtractionObject();
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
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// HCV prevalence in all IDU 
	
	// Display of infections (no data)
	NewDEO=new DataExtractionObject();
	
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
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// NSP in methadone maintenance
	
	NewDEO=new DataExtractionObject();
	
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
	
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	// Proportion previously 
	NewDEO=new DataExtractionObject();
	
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
	console.log("Not currently extracting");
	
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	// Proportion never 
	NewDEO=new DataExtractionObject();
	
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
	console.log("Not currently extracting");
	
	// Set optimisation
	NewDEO.Optimise=true;
	NewDEO.Optimisation.ProportionalError=true;
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// Fibrosis staging in all PLHCV
	
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
	
	
	
	// NSW Decompensted Cirrhosis
	NewDEO=new DataExtractionObject();
	
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
	DEO.push(NewDEO);
	
	
	
	
	
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	// Transplants
	NewDEO=new DataExtractionObject();
	
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
	DEO.push(NewDEO);
	
	
	
	
	// Treatment
	NewDEO=new DataExtractionObject();
	
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
	DEO.push(NewDEO);
	
	
	
	
	
	// NSW HCC diagnoses
	NewDEO=new DataExtractionObject();
	
	var DataStruct={};
	DataStruct.Time=Data.NSW.HCVHCCDiagnoses.Time;
	DataStruct.Value=Data.NSW.HCVHCCDiagnoses.Count;
	NewDEO.SetData(DataStruct);
	
	// Load the data into the function 
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSWHCCDiagnoses";
	NewDEO.Title="HCC diagnoses of people with HCV in NSW";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Number of people";
	
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	// NSW HCV mortality
	NewDEO=new DataExtractionObject();
	
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	
	// NSW HCV liver mortality
	NewDEO=new DataExtractionObject();
	
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	// ******************************************************************************************************
	// ******************************************************************************************************
	// ******************************************************************************************************
	// Incidence HITS-C
	NewDEO=new DataExtractionObject();
	
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
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
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
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
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
	DEO.push(NewDEO);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Give all plots an id in the intereface
	for (var Count in DEO){
		//DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of DataExtractionObject
}
