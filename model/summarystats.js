// This file contains functions that are designed to summarise information about individuals in the simulation. 
// There are two main types of summary stats:
// 1) Instantaneous count at that point in time e.g. total number of people currently infected with HCV on 1/6/2013
// 2) Total number of events that occur over a period e.g. the number of infections that occur over a period 2013=2016

// A summary stats call is structured as follows:
// 1) The name of the variable that you want to observe
// 2) The particular status of the variable you want to observe
// 3) The conditions on the person to be included. All people are included unless otherwise stated
// 3.1) An array of set values or
// 3.2) A range of values (inclusive)
// 4) The year that you want to observe it

// e.g. Summary stats request structure
RecentTeenageHCVInfections=new StatRequest();
RecentTeenageHCVInfections.VariableName="";


// Continuous variable range, instantaneous value
RecentTeenageHCVInfections.FunctionChooserString[0] = "function (PersonUnderInspecion, Time){return PersonUnderInspecion.Age(Time);}";// this will be evaled on the other side of the webworker
RecentTeenageHCVInfections.Lower[0] = 25;
RecentTeenageHCVInfections.Upper[0] = 35;
// Categorical variable value, instantaneous value
RecentTeenageHCVInfections.FunctionChooserString[1] = "function (PersonUnderInspecion, Time){return PersonUnderInspecion.HCV.FibrosisStage(Time);};"
RecentTeenageHCVInfections.Values[0] = [];
RecentTeenageHCVInfections.Values[0][0] = 3;//If the fibrosis stages are either 3 or 4 (but nothing else 
RecentTeenageHCVInfections.Values[0][1] = 4;//

