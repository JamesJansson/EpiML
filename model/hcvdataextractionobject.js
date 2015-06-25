//





// This function is run internally in each instance of the model
function SetupDataExtractionObjects(){
	
	var GraphTime=AscendingArray(1970, 2020, 1);
	
	var DEO=[];//Array of DataExtractionObject
	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
	// This section deals with the creation of summary statistics for ever injectors

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
			console.error("We need to work out a way of refrencing this.");
			
			var ObjectName="NumberOfPeopleEverInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
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
			NewDEO.Optimise=true;
			
			
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
			
			var ObjectName="NumberOfPeopleRecentlyInjectingDrugs"+SexText+LowerAge+"_"+UpperAge;
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
			
			// CReate a referenece that can be used to download the data in the future
			eval(ObjectName+"=NewDEO;");
			// Add the object to the array of all ODEOS
			DEO.push(NewDEO);
		}
	}

	

	
// ******************************************************************************************************
// ******************************************************************************************************
// ******************************************************************************************************
// This section deals with the creation of summary statistics for NSP survey data
	
	
	// Create a new object to extract heterosexual identity from NSP
	NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Divide(Data.NSP.SexId.Heterosexual, Data.NSP.SexId.Total);
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="HeterosexualNSPProp";
	NewDEO.Title="Proportion of NSP Heterosexualsexual";
	NewDEO.XLabel="Year";
	NewDEO.YLabel="Proportion";
	
	NewDEO.ResultFunction= function (SimulationResult, Time){
		var Heterosexual=0;
		var NSPTotal=0;
		for (var PersonCount in SimulationResult.Population){
			var Person=SimulationResult.Population[PersonCount];
			if (Person.Alive(Time)){
				// Check if NSP
				if (Person.IDU.NSP.Value(Time)){
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
				if (Person.IDU.NSP.Value(Time)){
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
				if (Person.IDU.NSP.Value(Time)){
					NSPTotal++;
					// Check if bisexual
					if (Person.Sexuality==2){
						Bisexual++;
					}
				}
			}
		}
		return Bisexual/NSPTotal;
	};
	
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
	
	NewDEO.ErrorFunction=function(SimulationResults){
		// There is a value in the simulation results that indicates the shortfall in the number of notifications
		// This value is calculated by age group
		
		// 
		var TotalPenalty=0;
		for (var Count in SimulationResults.HCVDataDiagnosisResults){
			var Pen=SimulationResults.HCVDataDiagnosisResults[Count].Penalty;
			TotalPenalty+=Pen.InsufficientInfectedToDiagnoseTotal+Pen.InsufficientSymptomaticDiagnosesTotal;
		}
		
		console.log("Total penalty for notifications: "+TotalPenalty);
		
		return TotalPenalty;
	};
	
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
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
	NewDEO.Title="Total People Living with HCV";
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
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
	
	NewDEO=new DataExtractionObject();
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.HCVAntiBody.Total.Proportion;// NSP HCV antibody prevalence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	NewDEO.SetData(DataStruct);
	NewDEO.SetGraphTime(GraphTime);
	NewDEO.Name="NSPHCVPntibodyProp";
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
		return AntibodyPresent/NSPTotal;
	};
	
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
			if (Person.IDU.CurrentlyInjecting(Time)){
				TotalInjecting++;
				// Check if CurrentlyInfected
				if (Person.HCV.CurrentlyInfected(Time)){
					TotalInfected++;
				}
			}
		}
		return TotalInfected/TotalInjecting;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
	DataStruct.Value=Data.NSP.Methadone.CurrentProp;// NSP HCV antibody prevalence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
		console.log("Not currently extracting");
		
		return 0;
	};
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	// Proportion previously 
	NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.Methadone.PreviousProp;// NSP HCV antibody prevalence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
		console.log("Not currently extracting");
		
		return 0;
	};
	
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	// Proportion never 
	NewDEO=new DataExtractionObject();
	
	// Load the data into the function 
	var DataStruct={};
	DataStruct.Time=Data.NSP.Year;
	DataStruct.Value=Data.NSP.Methadone.NeverProp;// NSP HCV antibody prevalence !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
		console.log("Not currently extracting");
		
		return 0;
	};
	
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==0){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==1){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==2){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==3){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==4){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
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
			// Check if CurrentlyInjecting
			if (Person.HCV.CurrentlyInfected(Time)){
				if (Person.HCV.Fibrosis.Value(Time)==5){
					Total++;
				}
			}
		}
		return Total*Settings.SampleFactor;
	};
	
	NewDEO.ErrorFunction=function(SimulationResults){
		return 0;
	};
	// Add the object to the array of all ODEOS
	DEO.push(NewDEO);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Give all plots an id in the intereface
	for (var Count in DEO){
		DEO[Count].GraphInterfaceID="OptimisationPlot"+Count;
	}
	
	return DEO;//Array of DataExtractionObject
}
